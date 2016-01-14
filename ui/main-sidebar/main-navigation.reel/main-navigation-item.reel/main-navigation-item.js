var Component = require("montage/ui/component").Component;

/**
 * @class MainNavigationItem
 * @extends Component
 */
exports.MainNavigationItem = Component.specialize({

    _class: {
        value: null
    },

    class: {
        get: function () {
            return this._class;
        },
        set: function (value) {
            if (this._class) {
                this.classList.remove(this._class);
            }
            this._class = "MainNavigationItem-" + value;
            this.classList.add(this._class);
        }
    }

});
