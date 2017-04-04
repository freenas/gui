var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({
    _currentView: {
        value: null
    },

    currentView: {
        get: function() {
            console.log(this._currentView);
            return this._currentView;
        },
        set: function(currentView) {
            if (this._currentView !== currentView) {
                console.log(currentView);
                this._currentView = currentView;
            }
        }
    },

    enterDocument: {
        value: function() {
            this.currentView = "day";
        }
    }
});
