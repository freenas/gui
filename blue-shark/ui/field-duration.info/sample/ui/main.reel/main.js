/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    converter: {
        value: {
            revert: function(date) {
                return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
            },
            convert: function(string) {
                var parts = string.split('/');
                return new Date(parts[2], parts[1], parts[0]);
            }
        }
    }
});
