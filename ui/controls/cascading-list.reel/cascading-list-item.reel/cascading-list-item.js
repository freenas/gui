var Component = require("montage/ui/component").Component;

/**
 * @class CascadingListItem
 * @extends Component
 */
exports.CascadingListItem = Component.specialize({

    _selectedObject: {
        value: null
    },

    selectedObject: {
        get: function () {
            return this._selectedObject;
        },
        set: function (value) {
            if (this._selectedObject !== value) {
                this._selectedObject = value;
                if (value) {
                    this.cascadingList.expand(value, this.data.columnIndex + 1);
                }
            }
        }
    },

    exitDocument: {
        value: function () {
            if (this.content && this.content.component && this.content.component.selectedObject) {
                this.content.component.selectedObject = null;
            }
        }
    },

    draw: {
        value: function () {
            if (!this._element.clientWidth) {
                this.needsDraw = true;
            } else {
                this._element.parentNode.scrollLeft = 1e10;
            }
        }
    }

});
