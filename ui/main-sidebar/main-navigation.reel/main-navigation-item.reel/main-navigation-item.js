/**
 * @module ui/main-navigation-item.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class MainNavigationItem
 * @extends Component
 */
exports.MainNavigationItem = Component.specialize(/** @lends MainNavigationItem# */ {
    enterDocument: {
        value: function(isFirstTime) {
            this.classList.add('MainNavigationItem-' + this.object.id);
            this.icon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#i-" + this.object.icon);
        }
    }
});
