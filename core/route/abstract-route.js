"use strict";
var _ = require("lodash");
var AbstractRoute = (function () {
    function AbstractRoute(eventDispatcherService) {
        this.eventDispatcherService = eventDispatcherService;
    }
    AbstractRoute.prototype.updateStackWithContext = function (stack, context) {
        this.popStackAtIndex(stack, context.columnIndex);
        stack.push(context);
        return stack;
    };
    AbstractRoute.prototype.popStackAtIndex = function (stack, index) {
        while (stack.length > index) {
            var context = stack.pop();
            if (context) {
                this.unregisterChangeListeners(context.changeListener);
            }
        }
    };
    AbstractRoute.prototype.unregisterChangeListeners = function (changeListeners) {
        if (changeListeners) {
            for (var _i = 0, _a = _.castArray(changeListeners); _i < _a.length; _i++) {
                var listener = _a[_i];
                this.eventDispatcherService.removeEventListener(listener.eventName, listener);
            }
        }
    };
    return AbstractRoute;
}());
exports.AbstractRoute = AbstractRoute;
