export class EventDispatcherService {
    private static instance:   EventDispatcherService;
    private listeners:  Map<string, Set<Function>>;

    private constructor() {
        this.listeners = new Map<any, Set<Function>>();
    }

    static getInstance(): EventDispatcherService {
        return EventDispatcherService.instance || (EventDispatcherService.instance = new EventDispatcherService());
    }

    public addEventListener(eventName: string, handler: Function) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set<Function>());
        }
        this.listeners.get(eventName).add(handler);
    }

    public removeEventListener(eventName: string, handler: Function) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(handler);
        }
    }

    public dispatch(eventName: string, detail?: any) {
        if (this.listeners.has(eventName)) {
            var handlers = this.listeners.get(eventName).values(),
                handler = handlers.next().value;
            while (typeof handler === 'function') {
                handler.call({}, detail);
                handler = handlers.next().value;
            }
        }
    }
}
