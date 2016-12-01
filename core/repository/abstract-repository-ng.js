"use strict";
var event_dispatcher_service_1 = require("core/service/event-dispatcher-service");
var AbstractRepository = (function () {
    function AbstractRepository(subscribedStateChanges, subscribedEvents) {
        if (subscribedStateChanges === void 0) { subscribedStateChanges = []; }
        if (subscribedEvents === void 0) { subscribedEvents = []; }
        var self = this;
        this.eventDispatcherService = event_dispatcher_service_1.EventDispatcherService.getInstance();
        var _loop_1 = function (subscribedStateChange) {
            this_1.eventDispatcherService.addEventListener('stateChange', function (data) {
                self.dispatchStateChange(subscribedStateChange, data);
            });
        };
        var this_1 = this;
        for (var _i = 0, subscribedStateChanges_1 = subscribedStateChanges; _i < subscribedStateChanges_1.length; _i++) {
            var subscribedStateChange = subscribedStateChanges_1[_i];
            _loop_1(subscribedStateChange);
        }
        var _loop_2 = function (subscribedEvent) {
            this_2.eventDispatcherService.addEventListener(subscribedEvent, function (data) {
                self.handleEvent(subscribedEvent, data);
            });
        };
        var this_2 = this;
        for (var _a = 0, subscribedEvents_1 = subscribedEvents; _a < subscribedEvents_1.length; _a++) {
            var subscribedEvent = subscribedEvents_1[_a];
            _loop_2(subscribedEvent);
        }
    }
    AbstractRepository.prototype.dispatchStateChange = function (name, state) {
        if (state.has(name)) {
            if (!this.previousState || this.previousState.get(name) !== state.get(name)) {
                this.handleStateChange(name, state.get(name));
                this.previousState = state;
            }
        }
    };
    return AbstractRepository;
}());
exports.AbstractRepository = AbstractRepository;
