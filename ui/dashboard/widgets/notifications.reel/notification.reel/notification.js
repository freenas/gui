/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component,
    Evaluate = require("frb/evaluate");

/**
 * @class Notification
 * @extends Component
 */
exports.Notification = Component.specialize(/** @lends Notification# */ {

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

    handleExpandButtonAction: {
        value: function () {
            this.infoExpanded = !this.infoExpanded;
        }
    }
});
