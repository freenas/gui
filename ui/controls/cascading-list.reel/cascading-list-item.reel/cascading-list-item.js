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
                var inspectorComponentModuleId = null;

                if (data) {
                    var defaultInspectorId = this.constructor.DEFAULT_INSPECTOR_ID,
                        userInterfaceDescriptor = data.userInterfaceDescriptor,
                        object = data.object;

                    this.isCollection = Array.isArray(object);
                    this.userInterfaceDescriptor = userInterfaceDescriptor;

                    if (userInterfaceDescriptor) {
                        //todo: need to be smarter here
                        if (this.isCollection) {
                            var collectionInspectorComponentModule = userInterfaceDescriptor.collectionInspectorComponentModule;

                            inspectorComponentModuleId = collectionInspectorComponentModule ?
                                collectionInspectorComponentModule.id : defaultInspectorId;

                        } else if (object && typeof object === "object") {
                            var inspectorComponentModule  = userInterfaceDescriptor.inspectorComponentModule,
                                objectPrototype = Object.getPrototypeOf(Object.getPrototypeOf(object)),
                                id = object.id;

                            if ((id == void 0 && id !== null) || !objectPrototype.hasOwnProperty("id")) {
                                inspectorComponentModuleId = inspectorComponentModule ?
                                    inspectorComponentModule.id : defaultInspectorId;
                            } else {
                                var creatorComponentModule = userInterfaceDescriptor.creatorComponentModule;

                                inspectorComponentModuleId = creatorComponentModule ? creatorComponentModule.id :
                                    inspectorComponentModule ? inspectorComponentModule.id : defaultInspectorId;
                            }
                        }
                    }
                }

                this._data = data;
                this.inspectorComponentModuleId = inspectorComponentModuleId;
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

}, {

    DEFAULT_INSPECTOR_ID: {
        value: 'ui/controls/viewer.reel'
    }

});
