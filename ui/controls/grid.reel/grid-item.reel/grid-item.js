var AbstractDraggableComponent = require("core/drag-drop/abstract-draggable-component").AbstractDraggableComponent;

/**
 * @class GridItem
 * @extends Component
 */
exports.GridItem = AbstractDraggableComponent.specialize({

    _placeHolderStrategy: {
        value: "hidden"
    }

});
