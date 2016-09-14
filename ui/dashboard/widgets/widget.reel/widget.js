var Component = require("montage/ui/component").Component;

/**
 * @class Widget
 * @extends Component
 */
exports.Widget = Component.specialize({
    _size: {
        value: null
    },

    size: {
        get: function () {
            return this._size;
        },
        set: function (option) {
            if(this._size !== option) {
                this.classList.remove("is-" + this._size);
                this.classList.add("is-" + option);
                this._size = option;
            }
        }
    },

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
