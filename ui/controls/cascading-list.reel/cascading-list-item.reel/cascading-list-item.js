var Component = require("montage/ui/component").Component;

/**
 * @class CascadingListItem
 * @extends Component
 */
exports.CascadingListItem = Component.specialize({

    _data: {
        value: null
    },

    data: {
        get: function () {
            return this._data;
        },
        set: function (data) {
            if (this._data !== data) {
                this._data = data;

                if (data) {
                    var object = data.object,
                        userInterfaceDescriptor = data.userInterfaceDescriptor;

                    this.isCollection = Array.isArray(object);
                    this.userInterfaceDescriptor = userInterfaceDescriptor;

                    //todo: need to be smarter here
                    if (this.isCollection) {
                        this.inspectorComponentModuleId = userInterfaceDescriptor.collectionInspectorComponentModule.id;
                    } else if (object && typeof object === "object") {
                        this.inspectorComponentModuleId = userInterfaceDescriptor.inspectorComponentModule.id;
                    }
                } else {
                    this.inspectorComponentModuleId = null;
                }
            }
        }
    },

    isCollection: {
        value: false
    },

    inspectorComponentModuleId: {
        value: null
    },

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
