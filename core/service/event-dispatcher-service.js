"use strict";
var EventDispatcherService = (function () {
    function EventDispatcherService() {
        this.listeners = new Map();
    }
    EventDispatcherService.getInstance = function () {
        return EventDispatcherService.instance || (EventDispatcherService.instance = new EventDispatcherService());
    };
    EventDispatcherService.prototype.addEventListener = function (eventName, handler) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(handler);
    };
    EventDispatcherService.prototype.removeEventListener = function (eventName, handler) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(handler);
        }
    };
    EventDispatcherService.prototype.dispatch = function (eventName, detail) {
        if (this.listeners.has(eventName)) {
            var handlers = this.listeners.get(eventName).values(), handler = handlers.next().value;
            while (typeof handler === 'function') {
                handler.call({}, detail);
                handler = handlers.next().value;
            }
        }
    };
    return EventDispatcherService;
}());
exports.EventDispatcherService = EventDispatcherService;
