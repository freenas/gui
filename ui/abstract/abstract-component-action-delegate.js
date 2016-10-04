var Component = require("montage/ui/component").Component;

var AbstractComponentActionDelegate = exports.AbstractComponentActionDelegate = Component.specialize({

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
            // FIXME: Possible bug in within the placeholder:
            // -> enterDocument gets call when the component is not in the document.
            if (this.preparedForActivationEvents && this._inDocument) {
                AbstractComponentActionDelegate.prototype._addEventListener.call(this);
            }
        }
    },

    _addEventListener: {
        value: function () {
            this.addEventListener("action", this, false);
        }
    },

    _removeEventListenersIfNeeded: {
        value: function () {
            if (this.preparedForActivationEvents) {
                this.removeEventListener("action", this, false);
            }
        }
    }

});
