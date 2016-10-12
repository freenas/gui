var AbstractDraggableComponent = require("blue-shark/core/drag-drop/abstract-draggable-component").AbstractDraggableComponent;

exports.TaskCategory = AbstractDraggableComponent.specialize({
    enterDocument: {
        value: function () {
            this.classList.add('type-' + this.object.value.replace('.', '_'));
        }
    }
});
