import {EventDispatcherService} from './event-dispatcher-service';
import {ModelEventName} from '../model-event-name';

import * as uuid from 'uuid';
import * as _ from 'lodash';
import {SubmittedTask} from '../model/SubmittedTask';
import {LoginInfo} from '../model/LoginInfo';
import {Events} from '../Events';

export class MiddlewareClient {
    private REQUEST_TIMEOUT = 90000;

    private static readonly FILE_READER_DONE = 2;
    private static readonly BUFSIZE = 1048576;
    private static readonly WEBSOCKET_CLOSE_NORMAL = 1000;
    private static readonly UNKNOWN_CONNECTION_STATUS = 99;


    private static readonly CONNECTING = 'CONNECTING';
    private static readonly OPEN = 'OPEN';
    private static readonly CONNECTED = 'CONNECTED';
    private static readonly CLOSED = 'CLOSED';

    private static readonly DISCONNECT_REDIRECT_TIMEOUT = 2000;

    private static instance: MiddlewareClient;
    private socket: WebSocket;
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
        this.state = MiddlewareClient.CONNECTING;
        return this.connectionPromise.then(() => {
            let payload = {
                namespace: 'rpc',
                name: 'auth',
                args: {
                    username: login,
                    password: password
                }
            };
            return this.send(payload);
        }).then(() => {
            this.url = MiddlewareClient.getHost();
            this.user = login;
            this.eventDispatcherService.dispatch(Events.userLoggedIn, ({
                url: this.url,
                username: this.user
            } as LoginInfo));
            this.state = MiddlewareClient.OPEN;
            this.dispatchConnectionStatus();
            return this.state;
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

    public submitTask(name: string, args?: Array<any>): Promise<SubmittedTask> {
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
                return new SubmittedTask(taskId, self.getTaskPromise(taskId));
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
        return new Promise((resolve, reject) => {
            let eventListener = this.eventDispatcherService.addEventListener(ModelEventName.Task.change(taskId), task => {
                switch (task.get('state')) {
                    case 'FINISHED':
                        resolve(task.get('result'));
                        this.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                        break;
                    case 'FAILED':
                        reject(task.get('error').toJS());
                        this.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                        break;
                    case 'ABORTED':
                        reject('Aborted');
                        this.eventDispatcherService.removeEventListener(ModelEventName.Task.change(taskId), eventListener);
                        break;
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
        let connection = new WebSocket(MiddlewareClient.getRootURL('ws') + '/dispatcher/file');

        connection.onopen = function () {
            connection.send(JSON.stringify({token: token}));
        };
        connection.onmessage = (event) => {
            let message = JSON.parse(event.data),
                filePos = 0;
            if (message.status === "ok") {
                console.log("Fileconnection authenticated for upload");
                this.sendChunkOnConnection(
                    connection, file, filePos, filePos + MiddlewareClient.BUFSIZE
                );
                connection.onmessage = (event) => this.handleMessage(event, this.url);
            }
        };
    }

    private sendChunkOnConnection(connection: WebSocket, file: File, start: number, stop: number) {
        start = start || 0;
        stop = stop || file.size;
        let reader = new FileReader();

        if (stop > file.size) {
            stop = file.size;
        }

        reader.onloadend = (event: any) => {
            let target: any = event.target;

            if (target.readyState === MiddlewareClient.FILE_READER_DONE) {
                connection.send(target.result);

                if ( stop == file.size ) {
                    connection.send(JSON.stringify({'done': true}));
                } else if ( stop + MiddlewareClient.BUFSIZE < file.size ) {
                    this.sendChunkOnConnection(
                        connection, file, stop, stop + MiddlewareClient.BUFSIZE
                    );
                } else {
                    this.sendChunkOnConnection(connection, file, stop, file.size);
                };
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
                payload: payload,
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
                console.log(error, payload);
                throw error;
            });
        });
    }

    private closeConnection() {
        console.log('Closing connection to ' + this.socket.url);
        this.socket.close(MiddlewareClient.WEBSOCKET_CLOSE_NORMAL);
        this.state = MiddlewareClient.CLOSED;
    }

    private openConnection(url: string): Promise<any> {
        if (!this.socket) {
            this.connectionPromise = new Promise((resolve, reject) => {
                console.log('Opening connection to ' + url);
                let isResolved = false;
                this.socket = new WebSocket(url);
                this.socket.onopen = () => {
                    isResolved = true;
                    resolve();
                };
                this.socket.onmessage = (event) => this.handleMessage(event, this.url);
                this.socket.onerror = (event) => {
                    if (!isResolved) {
                        reject(new MiddlewareError({
                            args: {
                                message: 'Server connection error'
                            }
                        }));
                    }
                    this.handleError(event, this.url);
                };
                this.socket.onclose = (event) => this.handleClose(event, this.url);
            }).then(() => {
                this.state = MiddlewareClient.CONNECTED;
                return this.dispatchConnectionStatus();
            });
        }
        return this.connectionPromise;
    }

    private dispatchConnectionStatus() {
        this.eventDispatcherService.dispatch('connectionStatusChange', this.state);
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
        }, MiddlewareClient.DISCONNECT_REDIRECT_TIMEOUT);
    }

    private handleMessage(event: MessageEvent, url: string) {
        try {
            let message = JSON.parse(event.data);

            if (message.namespace === 'rpc') {

                switch (message.name) {
                    case 'response':
                        this.handleRpcResponse(message);
                        break;

                    case 'error':
                        this.handleRpcError(message);
                        break;

                    case 'fragment':
                    case 'end':
                        this.handleFragmentResponse(message);
                        break;

                    default:
                        break;
                }
            } else if (message.namespace === 'events' && message.name === 'event') {
                this.handleEvent(message.args.name, message.args);
            } else if (message.namespace === 'events' && message.name === 'event_burst') {
                this.handleEventBurst(message.args.events);
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

    private handleFragmentResponse(message: any) {
        let messageId = message.id;

        if (this.handlers.has(messageId)) {
            let deferred = this.handlers.get(messageId);
            this.handlers.delete(messageId);
            deferred.resolve(message);
        }
    }

    private handleEvent(name: string, event: any) {
        if (_.startsWith(name, 'entity-subscriber.')) {
            this.eventDispatcherService.dispatch('middlewareModelChange', event.args);
        } else if (_.startsWith(name, 'statd.')) {
            this.eventDispatcherService.dispatch('statsChange', event);
        }
    }

    private handleEventBurst(events: Array<any>) {
        if (events && events.length > 0) {
            _.forEach(events, event => {
                this.handleEvent(event.name, event);
            });
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
