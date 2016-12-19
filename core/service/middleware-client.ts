import * as uuid from 'node-uuid';
import { EventDispatcherService } from './event-dispatcher-service';
import {ModelEventName} from "../model-event-name";
import * as Promise from "bluebird";
import _ = require("lodash");

export class MiddlewareClient {
    private REQUEST_TIMEOUT = 90000;
    private KEEPALIVE_MSG = '{"namespace": "rpc", "name": "call", "id": "${ID}", "args": {"method": "session.whoami", "args": []}}';
    private KEEPALIVE_PERIOD = 30000;

    private static instance: MiddlewareClient;
    private socket;
    private handlers: Map<string, any>;
    private connectionPromise: Promise<any>;
    private keepAliveInterval: number;

    public url: string;

    public constructor(private eventDispatcherService: EventDispatcherService) {
        this.handlers = new Map<string, Promise>();
    }

    public static getInstance() {
        if (!MiddlewareClient.instance) {
            MiddlewareClient.instance = new MiddlewareClient(
                EventDispatcherService.getInstance()
            );
        }
        return MiddlewareClient.instance;
    }

    public connect(url: string): Promise<any> {
        if (this.socket) {
            if (this.socket.url !== url && this.socket.readyState === this.socket.OPEN) {
                this.closeConnection();
            }
            this.socket = null;
        }
        return this.openConnection(url);
    }

    public login(login: string, password: string) {
        let self = this;
        return this.connectionPromise.then(function() {
            let payload = {
                namespace: 'rpc',
                name: 'auth',
                args: {
                    username: login,
                    password: password
                }
            };
            return self.send(payload);
        }).then(function() {
            return self.startKeepAlive();
        }, function(error: MiddlewareError) {
            if (error) {
                if (error.name === 'MiddlewareError') {
                    let message = error.middlewareMessage;
                    if (message.args) {
                        if (message.args.message) {
                            throw new Error(message.args.message);
                        }
                    }
                }
            }
        });
    }

    public callRpcMethod(name: string, args?: Array<any>): Promise {
        let self = this;
        return this.connectionPromise.then(function() {
            let payload = {
                namespace: 'rpc',
                name: 'call',
                args: {
                    method: name,
                    args: args || []
                }
            };

            return self.send(payload);
        });
    }

    public submitTask(name: string, args?: Array<any>): Promise {
        let self = this;
        return this.callRpcMethod("task.submit", [
                name,
                args || []
            ]).then(function(taskId) {
                return {
                    taskId: taskId,
                    taskPromise: new Promise(function(resolve, reject) {
                        let eventListener = self.eventDispatcherService.addEventListener(ModelEventName.Task.change(taskId), function(task) {
                            if (task.get('state') === 'FINISHED') {
                                resolve(task.get('result'));
                                self.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                            } else if (task.get('state') === 'FAILED') {
                                reject(task.get('error').toJS());
                                self.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                            }
                        });
                    })
                }
        });
    }

    public submitTaskWithDownload(name: string, args?: Array<any>): Promise<any> {
        let self = this;
        return this.callRpcMethod("task.submit_with_download", [
            name,
            args || []
        ]).then(function(response) {
            let taskId = response[0];
            return {
                taskId: taskId,
                taskPromise: new Promise(function(resolve, reject) {
                    let eventListener = self.eventDispatcherService.addEventListener(ModelEventName.Task.change(taskId), function(task) {
                        if (task.get('state') === 'FINISHED') {
                            resolve(task.get('result'));
                            self.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                        } else if (task.get('state') === 'FAILED') {
                            reject(task.get('error').toJS());
                            self.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                        }
                    });
                }),
                link: self.getRootURL('http') + response[1][0]
            }
        });
    }

    public submitTaskWithUpload(name: string, args: Array<any>, file: File) {
        let self = this;
        return this.callRpcMethod('task.submit_with_upload', _.concat([name], args)).then(function(response) {
            let token = Array.isArray(response) ? response[1][0] : response;
            self.sendFileWithToken(file, token);
        })
    }

    public uploadFile(file: File, destination: string, mode = '755') {
        let self = this;
        return this.callRpcMethod('filesystem.upload', ["/root/" + file.name, file.size, mode]).then(function(response) {
            let token = Array.isArray(response) ? response[1][0] : response;
            self.sendFileWithToken(file, token);
        })
    }

    private sendFileWithToken(file: File, token: string) {
        let self = this,
            connection = new WebSocket(self.getRootURL('ws') + '/dispatcher/file'),
            BUFSIZE = 1024;

        connection.onopen = function () {
            let filePos = 0;
            connection.send(JSON.stringify({token: token}));


            while (filePos + BUFSIZE <= file.size) {
                self.sendChunkOnConnection(connection, file, filePos, filePos + BUFSIZE);
                filePos = filePos + BUFSIZE;
            }

            if (filePos < file.size) {
                self.sendChunkOnConnection(connection, file, filePos, file.size);
            }
        };
    }

    private sendChunkOnConnection(connection: WebSocket, file: File, start: number, stop: number) {
        start = parseInt(start) || 0;
        stop = parseInt(stop) || file.size;
        let reader = new FileReader();

        reader.onloadend = function (event) {
            let target = event.target;

            if (target.readyState === FileReader.DONE) {
                connection.send(target.result);

                if (stop === file.size) {
                    connection.send("");
                }
            }
        };

        let blob = file.slice(start, stop);
        reader.readAsArrayBuffer(blob);
    }

    public subscribeToEvents(name: string) {
        return this.setEventSubscription(name, 'subscribe')
    }

    public unsubscribeFromEvents(name: string) {
        return this.setEventSubscription(name, 'unsubscribe')
    }

    private setEventSubscription(name: string, status: string) {
        let self = this,
            payload = {
                namespace: 'events',
                name: status,
                id: uuid.v4(),
                args: [name]
            };
        return this.connectionPromise.then(function() {
            return self.socket.send(JSON.stringify(payload));
        });
    }

    private startKeepAlive() {
        let self = this;
        this.keepAliveInterval = setInterval(
            () => self.socket.send(self.KEEPALIVE_MSG.replace('${ID}', uuid.v4())),
            this.KEEPALIVE_PERIOD
        );
    }

    private stopKeepalive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
    }

    private send(payload: any): Promise {
        let self = this;
        return this.connectionPromise.then(function() {
            let resolve, reject,
                promise = new Promise(function(_resolve, _reject) {
                    resolve = _resolve;
                    reject = _reject;
                });
            payload.id = uuid.v4();
            self.socket.send(JSON.stringify(payload));
            self.handlers.set(payload.id, {
                resolve: resolve,
                reject: reject,
                promise: promise
            });
            return promise.timeout(self.REQUEST_TIMEOUT).catch(function(error) {
                if (error) {
                    if (error.name === 'TimeoutError') {
                        console.log('[' + self.url + '] Request timeout: ' + JSON.stringify(payload));
                        self.handlers.get(payload.id).reject();
                        self.handlers.delete(payload.id);
                    }
                }
                console.log(error);
                throw error;
            });
        });
    }

    private closeConnection() {
        console.log('Closing connection to ' + this.socket.url);
        this.stopKeepalive();
        this.socket.close(1000);
    }

    private openConnection(url: string): Promise {
        let self = this;
        if (!this.socket) {
            this.connectionPromise = new Promise(function(resolve, reject) {
                console.log('Opening connection to ' + url);
                let isResolved = false;
                self.socket = new WebSocket(url);
                self.stopKeepalive();
                self.socket.onopen = function() {
                    isResolved = true;
                    resolve();
                };
                self.socket.onmessage = (event) => self.handleMessage(event);
                self.socket.onerror = function(event) {
                    if (!isResolved) {
                        reject(new MiddlewareError({
                            args: {
                                message: 'Server connection error'
                            }
                        }));
                    }
                    self.handleError(event);
                };
                self.socket.onclose = (event) => self.handleClose(event);
            }).then(function() {
                return self.dispatchConnectionStatus();
            });
        }
        return this.connectionPromise;
    }

    private dispatchConnectionStatus() {
        this.eventDispatcherService.dispatch('connectionStatusChange', this.socket ? this.socket.status : 99);
    }

    private handleError(event: Event) {
        console.warn('[' + event.currentTarget.url + '] WS connection error:', event);
        this.dispatchConnectionStatus();
        this.stopKeepalive();
        this.connectionPromise = null;
        this.socket = null;
    }

    private handleClose(event: Event) {
        console.log('[' + event.currentTarget.url + '] WS connection closed', event);
        this.dispatchConnectionStatus();
        this.stopKeepalive();
        this.connectionPromise = null;
        this.socket = null;
    }

    private handleMessage(event: Event) {
        try {
            let message = JSON.parse(event.data);
            if (message.namespace === 'rpc') {
                if (message.name === 'response') {
                    this.handleRpcResponse(message);
                } else if (message.name == 'error') {
                    this.handleRpcError(message);
                }
            } else if (message.namespace === 'events' && message.name === 'event') {
                this.handleEvent(message);
            }
        } catch (error) {
            console.warn('[' + event.currentTarget.url + '] Unable to parse message: -' + event.data +'-');
        }
    }

    private handleRpcResponse(message: any) {
        if (this.handlers.has(message.id)) {
            let deferred = this.handlers.get(message.id);
            this.handlers.delete(message.id);
            deferred.resolve(message.args);
        }
    }

    private handleRpcError(message: any) {
        if (this.handlers.has(message.id)) {
            let deferred = this.handlers.get(message.id);
            this.handlers.delete(message.id);
            deferred.reject(new MiddlewareError(message));
        }
    }

    private handleEvent(message: any) {
        if (message.args.name.indexOf('entity-subscriber.') === 0) {
            this.eventDispatcherService.dispatch('middlewareModelChange', message.args.args);
        } else if (message.args.name.indexOf('statd.') === 0) {
            this.eventDispatcherService.dispatch('statsChange', message.args);
        }
    }

    private getRootURL(protocol: string): string {
        let scheme = protocol + (location.protocol === 'https:' ? 's' : ''),
            host = this.getHost();
        return `${scheme}://${host}`;
    }

    private getHost(): string {
        let result = location.host,
            hostParam = location.href.split(';').filter(
                (x) => x.split('=')[0] === 'host'
            )[0];
        if (hostParam) {
            let host = hostParam.split('=')[1];
            if (host && host.length > 0) {
                result = host;
            }
        }
        return result;
    }
}

class MiddlewareError extends Error {
    public name: string = 'MiddlewareError';
    public message: string;
    public middlewareMessage: any;

    public constructor(middlewareMessage: any) {
        super();
        this.message = middlewareMessage.args.message;
        this.middlewareMessage = middlewareMessage;
    }
}
