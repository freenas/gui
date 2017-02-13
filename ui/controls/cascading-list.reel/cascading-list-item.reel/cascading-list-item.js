var Component = require("montage/ui/component").Component,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService,
    RoutingService = require("core/service/routing-service").RoutingService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventChange = require("core/model-event-name").ModelEventName,
    _ = require("lodash");

exports.CascadingListItem = Component.specialize({
    constructor: {
        value: function() {
            this.eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    templateDidLoad: {
        value: function() {
            this.modelDescriptorService = ModelDescriptorService.getInstance();
            this.routingService = RoutingService.getInstance();
        }
    },

    _data: {
        value: null
    },

    helpShown: {
        value: false
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
                        object = this.object = data.object;
                    this._removeObjectDeletedListener();
                    if (ModelEventChange[data.objectType]) {
                        this._objectDeletedListener = this.eventDispatcherService.addEventListener(ModelEventChange[data.objectType].remove(data.object.id), this._handleObjectDeleted.bind(this))
                    }

                    data.cascadingListItem = this;
                    this.isCollection = Array.isArray(object);
                    this.userInterfaceDescriptor = userInterfaceDescriptor;
                    this.error = data.error;

                    if (userInterfaceDescriptor) {
                        //todo: need to be smarter here
                        if (this.isCollection) {
                            var collectionInspectorComponentModule = userInterfaceDescriptor.collectionInspectorComponentModule;

                            inspectorComponentModuleId = collectionInspectorComponentModule ?
                                (collectionInspectorComponentModule.id || collectionInspectorComponentModule['%']) : defaultInspectorId;

                        } else if (object && typeof object === "object") {
                            var inspectorComponentModule = userInterfaceDescriptor.inspectorComponentModule,
                                id = object.id;

                            if ((id !== void 0 && id !== null) || object._isNewObject) {
                                inspectorComponentModuleId = inspectorComponentModule ?
                                    (inspectorComponentModule.id || inspectorComponentModule['%']) : defaultInspectorId;
                            } else {
                                var creatorComponentModule = userInterfaceDescriptor.creatorComponentModule;

                                inspectorComponentModuleId = creatorComponentModule ? (creatorComponentModule.id || creatorComponentModule['%']) :
                                    inspectorComponentModule ? (inspectorComponentModule.id || inspectorComponentModule['%']) : defaultInspectorId;
                            }
                        }
                    }
                } else {
                    this.object = null;
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
        value: void 0
    },

    needToScrollIntoView: {
        value: false
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addEventListener("placeholderContentLoaded", this);
            }
        }
    },

    exitDocument: {
        value: function() {
            this._removeObjectDeletedListener();
            this.data = null;
            this.object = null;
            this.selectedKey = null;
        }
    },

    handlePlaceholderContentLoaded: {
        value: function (event) {
            if (event.detail === this.content) {
                this.needToScrollIntoView = true;
                this.needsDraw = true;
            }
        }
    },

    resetSelection: {
        value: function () {
            this.selectedObject = null;

            if (this.content && this.content.component && this.content.component.selectedObject) {
                this.content.component.selectedObject = null;
            }
        }
    },


    dismiss: {
        value: function () {
            if (this._inDocument) {
                this.cascadingList.popAtIndex(this.data.columnIndex);
            }
        }
    },

    handleHelpButtonAction: {
        value: function () {
            this.helpShown = !this.helpShown;
        }
    },

    draw: {
        value: function () {
            if (this.needToScrollIntoView) {
                if (!this.content._element.clientWidth) {
                    this.needsDraw = true;
                } else {
                    this.cascadingList.scrollView.scrollIntoView(this.element);
                    this.needToScrollIntoView = false;
                }
            }
        }
    },

    _removeObjectDeletedListener: {
        value: function () {
            if (this._objectDeletedListener && this._data && this._data.object) {
                this.eventDispatcherService.removeEventListener(ModelEventChange[this._data.objectType].remove(this._data.object.id), this._objectDeletedListener);
            }
        }
    },

    _handleObjectDeleted: {
        value: function() {
            if (this._inDocument && this.data && this.data.parentContext) {
                this.routingService.navigate(this.data.parentContext.path);
            }
        }
    }

}, {

    DEFAULT_INSPECTOR_ID: {
        value: 'ui/controls/viewer.reel'
    }

});
