/**
 * @module ui/widget-wrapper.reel
 */
var AbstractDraggableComponent = require("blue-shark/core/drag-drop/abstract-draggable-component").AbstractDraggableComponent;

/**
 * @class WidgetWrapper
 * @extends Component
 */
exports.WidgetWrapper = AbstractDraggableComponent.specialize(/** @lends WidgetWrapper# */ {

    _placeHolderStrategy: {
        value: "remove"
    },

    isGhostImageCenter: {
        value: false
    }

});
