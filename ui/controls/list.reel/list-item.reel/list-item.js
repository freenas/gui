var Button = require("montage/ui/button.reel").Button,
    RoutingService = require("core/service/routing-service").RoutingService,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

exports.ListItem = Button.specialize({

    hasTemplate: {
        value: true
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
                if (object) {
                    this._loadUserInterfaceDescriptor();
                }
            }
        }
    },

    parentCascadingListItem: {
        get: function () {
            return this._parentCascadingListItem ||
                (this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this));
        }
    },

    templateDidLoad: {
        value: function() {
            this.routingService = RoutingService.getInstance();
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            this._canDrawGate.setField(this.constructor.CAN_DRAW_FIELD, false);
            Promise.all([
                this.getSelectionKey(this.object),
                this._loadUserInterfaceDescriptor()
            ]).spread(function(selectionKey) {
                self.selectionKey = selectionKey;
                self._canDrawGate.setField(self.constructor.CAN_DRAW_FIELD, true);
            });
            this.pathChangeListener = this.routingService.subscribe('path', this.handlePathChange.bind(this));
            this.handlePathChange();
        }
    },

    exitDocument: {
        value: function() {
            this.routingService.unsubscribe(this.pathChangeListener);
        }
    },

    getSelectionKey: {
        value: function (object) {
            var result = this.property;
            if (result && this.objectType) {
                result += '[' + this.objectType;
            } else if (object) {
                object._objectType = this.objectType || object._objectType;
                result = this.routingService.getKeyFromObject(object);
            }
            return Promise.resolve(result);
        }
    },

    _loadUserInterfaceDescriptor: {
        value: function() {
            if (this.object) {
                var self = this,
                    promise;
                this.isCollection = Array.isArray(this.object);

                promise = this.application.modelDescriptorService.getUiDescriptorForType(this.objectType || this.object._objectType);

                if (promise) {
                    return promise.then(function(uiDescriptor) {
                        self.userInterfaceDescriptor = uiDescriptor;
                    });
                }
            } else {
                return Promise.resolve();
            }
        }
    },

    handlePathChange: {
        value: function() {
            if (this.selectionKey && this.parentCascadingListItem && this.parentCascadingListItem.selectedKey === this.selectionKey ) {
                this.classList.add("selected");
                this.element.classList.add("selected");
            } else {
                this.classList.remove("selected");
                this.element.classList.remove("selected");
            }
        }
    },

    handlePress: {
        value: function () {
            this.active = false;
            if (this.parentCascadingListItem && this.parentCascadingListItem.data.isRelative) {
                this.property = this.index;
            }
            if (this.property || this.parentCascadingListItem.data.isRelative) {
                this.parentCascadingListItem.selectProperty(this.property, this.objectType);
            } else if (this.object) {
                this.parentCascadingListItem.selectObject(this.object);
            }
            this.classList.add("selected");
            this.element.classList.add("selected");
            this._removeEventListeners();
        }
    }
}, {
    CAN_DRAW_FIELD: {
        value: 'userInterfaceDescriptorLoaded'
    }
});
