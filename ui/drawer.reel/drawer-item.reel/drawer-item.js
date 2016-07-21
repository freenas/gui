/**
 * @module ui/drawer-item.reel
 */
var AbstractDraggableComponent = require("blue-shark/core/drag-drop/abstract-draggable-component").AbstractDraggableComponent;

/**
 * @class DrawerItem
 * @extends Component
 */
exports.DrawerItem = AbstractDraggableComponent.specialize(/** @lends DrawerItem# */ {

    hasToggled: {
        value: false
    },

    handleInfoToggleAction: {
        value: function () {
            this.hasToggled = !this.hasToggled;
        }
    },

    _placeHolderStrategy: {
        value: "hidden"
    },

    isGhostImageCenter: {
        value: false
    }

});
