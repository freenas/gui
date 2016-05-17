/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component,
    Evaluate = require("frb/evaluate");

/**
 * @class AlertNotification
 * @extends Component
 */
exports.AlertNotification = Component.specialize(/** @lends AlertNotification# */ {

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
            }
        },
        get: function () {
            return this._object;
        }
    },

    UIDescriptor: {
        value: null
    },

    infoExpanded: {
        value: false
    },

    handleDismissButtonAction: {
        value: function () {
            console.log('dismiss');
        }
    }
});
