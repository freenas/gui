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

    _size: {
        value: null
    },

    size: {
        get: function () {
            return this._size;
        },
        set: function (option) {
            if(this._size !== option) {
                this.classList.remove("Widget--" + this._size);
                this.classList.add("Widget--" + option);
                this._size = option;
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if(isFirstTime) {
                this.size = "small";
            }
        }
    }

});
