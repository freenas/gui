/**
 * @module ui/drawer-item.reel
 */
var AbstractDraggableComponent = require("blue-shark/core/drag-drop/abstract-draggable-component").AbstractDraggableComponent;

/**
 * @class DrawerItem
 * @extends Component
 */
exports.DrawerItem = AbstractDraggableComponent.specialize(/** @lends DrawerItem# */ {

    _hasToggled: {
        value: false
    },

    hasToggled: {
        set: function (hasToggled) {
            hasToggled = !!hasToggled;

            if (this._hasToggled !== hasToggled) {

                this._hasToggled = hasToggled;

                if (hasToggled) {
                    this.classList.add('has-toggled');
                } else {
                    this.classList.remove('has-toggled');
                }
            }
        },
        get: function () {
            return this._hasToggled;
        }
    },

    _placeHolderStrategy: {
        value: "hidden"
    },

    isGhostImageCenter: {
        value: false
    }

});
