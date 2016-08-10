var Component = require("montage/ui/component").Component;

/**
 * @class Widget
 * @extends Component
 */
exports.Widget = Component.specialize({

    isFlipped: {
        value: false
    },

    hasSettings: {
        value: false
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime && this._domArguments) {
                this.hasSettings = !!this._domArguments["widget-settings"];
            }
        }
    }

});
