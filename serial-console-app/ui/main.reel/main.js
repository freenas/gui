/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    templateDidLoad: {
        value: function() {
            window._montageWindow = this.application.window;
            this.token = window.location.hash.substr(1);
        }
    }
});
