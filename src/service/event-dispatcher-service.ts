import * as _ from "lodash";

export class EventDispatcherService {
    private static instance:   EventDispatcherService;
    private listeners:  Map<string, Set<Function>>;

    private constructor() {
        this.listeners = new Map<any, Set<Function>>();
    }

    static getInstance(): EventDispatcherService {
        return EventDispatcherService.instance || (EventDispatcherService.instance = new EventDispatcherService());
    }

    public addEventListener(eventName: string, handler: Function): Function {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set<Function>());
        }
        this.listeners.get(eventName).add(handler);
        (handler as any).eventName = eventName;
        return handler;
    }

    public removeEventListener(eventName: string, handler: Function) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(handler);
        }
    }

    public dispatch(eventName: string, detail?: any) {
        let promise;
        if (this.listeners.has(eventName)) {
            let handlers = this.listeners.get(eventName);
            promise = Promise.all(_.map(Array.from(handlers), (handler) => handler.call({}, detail)))
                .then((results) => !_.every(results));
        } else {
            promise = Promise.resolve();
        }
        return promise;
    }
}
