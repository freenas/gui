import * as uuid from 'node-uuid';
import { EventDispatcherService } from './event-dispatcher-service';

export class MiddlewareClient {
    private REQUEST_TIMEOUT = 60000;
    private KEEPALIVE_MSG = '{"namespace": "rpc", "name": "call", "id": "${ID}", "args": {"method": "session.whoami", "args": []}}';
    private KEEPALIVE_PERIOD = 30000;

    private static instance: MiddlewareClient;
    private socket;
    private handlers: Map<string, Promise>;

    private constructor() {
        this.handlers = new Map<string, Promise>();
        this.eventDispatcherService = EventDispatcherService.getInstance();
    }

    public static getInstance() {
        if (!MiddlewareClient.instance) {
            MiddlewareClient.instance = new MiddlewareClient();
        }
        return MiddlewareClient.instance;
    }

    public connect(url: string): Promise {
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
        }).then(function(message) {
            return self.startKeepAlive();
        }, function(error) {
            if (error) {
                if (error.name === 'MiddlewareError') {
                    let message = error.message;
                    if (message.args) {
                        if (message.args.code === 13) {
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
        let self = this,
            task = [
                name,
                args || []
            ];
        return this.callRpcMethod("task.submit", task);
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

    private send(payload: Object): Promise {
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
            this.connectionPromise = new Promise(function(resolve) {
                console.log('Opening connection to ' + url);
                self.socket = new WebSocket(url);
                self.stopKeepalive();
                self.socket.onopen = resolve;
                self.socket.onmessage = (event) => self.handleMessage(event);
                self.socket.onerror = (event) => self.handleError(event);
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

    private handleRpcResponse(message: Object) {
        if (this.handlers.has(message.id)) {
            let deferred = this.handlers.get(message.id);
            this.handlers.delete(message.id);
            deferred.resolve(message.args);
        }
    }

    private handleRpcError(message: Object) {
        if (this.handlers.has(message.id)) {
            let deferred = this.handlers.get(message.id);
            this.handlers.delete(message.id);
            deferred.reject(new MiddlewareError(message));
        }
    }

    private handleEvent(message: Object) {
        if (message.args.name.indexOf('entity-subscriber.') === 0) {
            this.eventDispatcherService.dispatch('middlewareModelChange', message.args.args);
        } else if (message.args.name.indexOf('statd.') === 0) {
            this.eventDispatcherService.dispatch('statsChange', message.args);
        }
    }
}

class MiddlewareError extends Error {
    public name: string = 'MiddlewareError';
    public message: string;
    public middlewareMessage: Object;
    
    public constructor(middlewareMessage: Object) {
        super();
        this.message = middlewareMessage.args.message;
        this.middlewareMessage = middlewareMessage;
    }
}
