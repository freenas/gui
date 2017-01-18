import {EventDispatcherService} from './event-dispatcher-service';
import {ModelEventName} from '../model-event-name';

import * as uuid from 'uuid';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

export class MiddlewareClient {
    private REQUEST_TIMEOUT = 90000;

    private static CONNECTING = 'CONNECTING';
    private static OPEN = 'OPEN';
    private static CLOSED = 'CLOSED';

    private static instance: MiddlewareClient;
    private socket;
    private handlers: Map<string, any>;
    private connectionPromise: Promise<any>;

    public url: string;
    public user: string;
    public state: string;

    public constructor(private eventDispatcherService: EventDispatcherService) {
        this.handlers = new Map<string, any>();
    }

    public static getInstance() {
        if (!MiddlewareClient.instance) {
            MiddlewareClient.instance = new MiddlewareClient(
                EventDispatcherService.getInstance()
            );
        }
        return MiddlewareClient.instance;
    }

    public connect(url?: string): Promise<any> {
        url = url || MiddlewareClient.getRootURL('ws') + '/dispatcher/socket';
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
        this.state = MiddlewareClient.CONNECTING;
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
            self.url = MiddlewareClient.getHost();
            self.user = login;
            self.eventDispatcherService.dispatch('SessionOpened', {
                url: self.url,
                user: self.user
            });
            return self.state = MiddlewareClient.OPEN;
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

     public continueRpcMethod(id: string, sequence: number): Promise<any> {
        return this.connectionPromise.then(() => {
            let payload = {
                namespace: 'rpc',
                name: 'continue',
                id: id,
                args: sequence
            };

            return this.send(payload);
        });
    }

    public enableStreamingResponses(): Promise<any> {
        return this.callRpcMethod('management.enable_features', [['streaming_responses']]);
    }

    public callRpcMethod(name: string, args?: Array<any>): Promise<any> {
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

    public submitTask(name: string, args?: Array<any>): Promise<any> {
        let self = this,
            temporaryTaskId = uuid.v4();
        this.eventDispatcherService.dispatch('taskSubmitted', temporaryTaskId);
        return this.callRpcMethod('task.submit', [
                name,
                args || []
            ]).then(function(taskId) {
                self.eventDispatcherService.dispatch('taskCreated', {
                    old: temporaryTaskId,
                    new: taskId
                });
                return {
                    taskId: taskId,
                    taskPromise: self.getTaskPromise(taskId)
                };
        });
    }

    public submitTaskWithDownload(name: string, args?: Array<any>): Promise<any> {
        let self = this,
            temporaryTaskId = uuid.v4();
        this.eventDispatcherService.dispatch('taskSubmitted', temporaryTaskId);
        return this.callRpcMethod('task.submit_with_download', [
            name,
            args || []
        ]).spread(function(taskId, links) {
            self.eventDispatcherService.dispatch('taskCreated', {
                old: temporaryTaskId,
                new: taskId
            });
            return {
                taskId: taskId,
                taskPromise: self.getTaskPromise(taskId),
                link: MiddlewareClient.getRootURL('http') + links[0]
            };
        });
    }

    private getTaskPromise(taskId: any): Promise<any> {
        let self = this;
        return new Promise(function (resolve, reject) {
            let eventListener = self.eventDispatcherService.addEventListener(ModelEventName.Task.change(taskId), function (task) {
                if (task.get('state') === 'FINISHED') {
                    resolve(task.get('result'));
                    self.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                } else if (task.get('state') === 'FAILED') {
                    reject(task.get('error').toJS());
                    self.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                }
            });
        });
    }

    public submitTaskWithUpload(name: string, args: Array<any>, file: File) {
        let self = this,
            temporaryTaskId = uuid.v4();
        this.eventDispatcherService.dispatch('taskSubmitted', temporaryTaskId);
        return this.callRpcMethod('task.submit_with_upload', [name, args]).spread(function(taskId, tokens) {
            self.eventDispatcherService.dispatch('taskCreated', {
                old: temporaryTaskId,
                new: taskId
            });
            self.sendFileWithToken(file, tokens[0]);
        });
    }

    public uploadFile(file: File, destination: string, mode = '755') {
        let self = this;
        return this.callRpcMethod('filesystem.upload', ['/root/' + file.name, file.size, mode]).then(function(response) {
            let token = Array.isArray(response) ? response[1][0] : response;
            self.sendFileWithToken(file, token);
        });
    }

    private sendFileWithToken(file: File, token: string) {
        let self = this,
            connection = new WebSocket(MiddlewareClient.getRootURL('ws') + '/dispatcher/file'),
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
        start = start || 0;
        stop = stop || file.size;
        let reader = new FileReader();

        reader.onloadend = function (event) {
            let target = event.target;

            if ((target as any).readyState === 2) {
                connection.send((target as any).result);

                if (stop === file.size) {
                    connection.send('');
                }
            }
        };

        let blob = file.slice(start, stop);
        reader.readAsArrayBuffer(blob);
    }

    public subscribeToEvents(name: string | Array<string>) {
        return this.setEventSubscription(typeof name === 'string' ? [name] : name, 'subscribe');
    }

    public unsubscribeFromEvents(name: string | Array<string>) {
        return this.setEventSubscription(typeof name === 'string' ? [name] : name, 'unsubscribe');
    }

    public getExplicitHostParam(): string {
        return MiddlewareClient.getHostParam() || '';
    }

    private setEventSubscription(name: Array<string>, status: string) {
        let self = this,
            payload = {
                namespace: 'events',
                name: status,
                id: uuid.v4(),
                args: name
            };
        return this.connectionPromise.then(function() {
            return self.socket.send(JSON.stringify(payload));
        });
    }

    private send(payload: any): Promise<any> {
        let self = this;
        return this.connectionPromise.then(function() {
            let resolve, reject,
                promise = new Promise(function(_resolve, _reject) {
                    resolve = _resolve;
                    reject = _reject;
                });

            if (!payload.id) {
                payload.id = uuid.v4();
            }

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
        this.socket.close(1000);
        this.state = MiddlewareClient.CLOSED;
    }

    private openConnection(url: string): Promise<any> {
        let self = this;
        if (!this.socket) {
            this.connectionPromise = new Promise(function(resolve, reject) {
                console.log('Opening connection to ' + url);
                let isResolved = false;
                self.socket = new WebSocket(url);
                self.socket.onopen = function() {
                    isResolved = true;
                    resolve();
                };
                self.socket.onmessage = (event) => self.handleMessage(event, self.url);
                self.socket.onerror = function(event) {
                    if (!isResolved) {
                        reject(new MiddlewareError({
                            args: {
                                message: 'Server connection error'
                            }
                        }));
                    }
                    self.handleError(event, self.url);
                };
                self.socket.onclose = (event) => self.handleClose(event, self.url);
            }).then(function() {
                return self.dispatchConnectionStatus();
            });
        }
        return this.connectionPromise;
    }

    private dispatchConnectionStatus() {
        this.eventDispatcherService.dispatch('connectionStatusChange', this.socket ? this.socket.status : 99);
    }

    private handleError(event: Event, url: string) {
        console.warn('[' + url + '] WS connection error:', event);
        this.dispatchConnectionStatus();
        this.state = MiddlewareClient.CLOSED;
        this.connectionPromise = null;
        this.socket = null;
    }

    private handleClose(event: Event, url: string) {
        console.log('[' + url + '] WS connection closed', event);
        this.dispatchConnectionStatus();
        this.state = MiddlewareClient.CLOSED;
        this.connectionPromise = null;
        this.socket = null;
        setTimeout(function() {
            if (window.location.hash.length === 0) {
                window.location.hash = '#';
            }
            if (window.location.hash.indexOf(';disconnected') === -1) {
                window.location.hash += ';disconnected';
            }
            location.reload();
        }, 2000);
    }

    private handleMessage(event: MessageEvent, url: string) {
        try {
            let message = JSON.parse(event.data);

            if (message.namespace === 'rpc') {
                let messageName = message.name;

                switch (message.name) {
                    case "response":
                        this.handleRpcResponse(message);
                        break;

                    case "error":
                        this.handleRpcError(message);
                        break;

                    case "fragment":
                    case "end":
                        this.handleFragmentResponse(message);
                        break;

                    default:
                        break;
                }
            } else if (message.namespace === 'events' && message.name === 'event') {
                this.handleEvent(message);
            }
        } catch (error) {
            console.warn('[' + url + '] Unable to handle message: -' + event.data + '-');
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

    private handleFragmentResponse(message: Object) {
        let messageId = message.id;

        if (this.handlers.has(messageId)) {
            let deferred = this.handlers.get(messageId);
            this.handlers.delete(messageId);
            deferred.resolve(message);
        }
    }

    private handleEvent(message: any) {
        if (_.startsWith(message.args.name, 'entity-subscriber.')) {
            this.eventDispatcherService.dispatch('middlewareModelChange', message.args.args);
        } else if (_.startsWith(message.args.name, 'statd.')) {
            this.eventDispatcherService.dispatch('statsChange', message.args);
        }
    }

    private static getRootURL(protocol: string): string {
        let scheme = protocol + (location.protocol === 'https:' ? 's' : ''),
            host = MiddlewareClient.getHost();
        return `${scheme}://${host}`;
    }

    private static getHost(): string {
        let result = location.host,
            hostParam = MiddlewareClient.getHostParam();
        if (hostParam) {
            let host = hostParam.split('=')[1];
            if (host && host.length > 0) {
                result = _.head(_.split(host, ';'));
            }
        }
        return result;
    }

    private static getHostParam(): string {
        return _.find(_.split(location.href, /[?&]/), (param) => _.startsWith(param, 'host='));
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
