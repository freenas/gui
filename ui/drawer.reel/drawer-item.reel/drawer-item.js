/**
 * @module ui/drawer-item.reel
 */
var AbstractDraggableComponent = require("core/drag-drop/abstract-draggable-component").AbstractDraggableComponent;

/**
 * @class DrawerItem
 * @extends Component
 */
exports.DrawerItem = AbstractDraggableComponent.specialize(/** @lends DrawerItem# */ {

    _placeHolderStrategy: {
        value: "hidden"
    }

});
