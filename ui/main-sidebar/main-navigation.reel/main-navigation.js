var Component = require("montage/ui/component").Component;

/**
 * @class MainNavigation
 * @extends Component
 */
exports.MainNavigation = Component.specialize({

    enterDocument: {
        value: function () {
            this._addEventListenerIfNeeded();
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._addEventListener();
        }
    },

    exitDocument: {
        value: function () {
            this._removeEventListenersIfNeeded();
        }
    },

    handlePreferencesAction: {
        value: function () {
            this.application.section = 'preferences';
        }
    },

    _addEventListenerIfNeeded: {
        value: function () {
            if (this.preparedForActivationEvents) {
                this._addEventListener();
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
                this.addEventListener("action", this, false);
            }
        }
    }

});

// FIXME: Selection needs to be managed by a selection controller
