/**
 * @module ui/drawer-item.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class DrawerItem
 * @extends Component
 */
exports.DrawerItem = Component.specialize(/** @lends DrawerItem# */ {

    hasToggled: {
        value: false
    },

    handleInfoToggleAction: {
        value: function () {
            this.hasToggled = !this.hasToggled;
        }
    }
});
