var Component = require("montage/ui/component").Component;

/**
 * @class AbstractComponentActionDelegate
 * @extends Component
 */
var AbstractComponentActionDelegate = exports.AbstractComponentActionDelegate = Component.specialize({


    //Fixme: workaround for the eventManager
    __ACTION_EVENT_SET: {
        value: false
    },

    enterDocument: {
        value: function () {
            AbstractComponentActionDelegate.prototype._addEventListenerIfNeeded.call(this);

            if (!this.prepareForActivationEvents) {
                Object.getPrototypeOf(this).prepareForActivationEvents = AbstractComponentActionDelegate.prototype.prepareForActivationEvents;
            }

            if (!this.exitDocument) {
                Object.getPrototypeOf(this).prepareForActivationEvents = AbstractComponentActionDelegate.prototype.exitDocument;
            }
        }
    },

    prepareForActivationEvents: {
        value: function () {
            AbstractComponentActionDelegate.prototype._addEventListener.call(this);
        }
    },

    exitDocument: {
        value: function () {
            AbstractComponentActionDelegate.prototype._removeEventListenersIfNeeded.call(this);
        }
    },

    _addEventListenerIfNeeded: {
        value: function () {
            // FIXME: there is a bug in the event manager:
            // -> It's possible to add several event listeners for the same listener and the event type.
            // FIXME: Possible bug in within the placeholder:
            // -> enterDocument gets call when the component is not in the document.
            if (this.preparedForActivationEvents && this._inDocument && !this.__ACTION_EVENT_SET) {
                AbstractComponentActionDelegate.prototype._addEventListener.call(this);
            }
        }
    },

    _addEventListener: {
        value: function () {
            this.__ACTION_EVENT_SET = true;
            this.addEventListener("action", this, false);
        }
    },

    _removeEventListenersIfNeeded: {
        value: function () {
            if (this.preparedForActivationEvents) {
                this.__ACTION_EVENT_SET = false;
                this.removeEventListener("action", this, false);
            }
        }
    }

});
