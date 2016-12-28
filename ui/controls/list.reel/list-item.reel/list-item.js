var Button = require("montage/ui/button.reel").Button,
    RoutingService = require("core/service/routing-service").RoutingService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    _ = require("lodash");

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
            this.eventDispatcherService = EventDispatcherService.getInstance();
            this.routingService = RoutingService.getInstance();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener('path', this, '_handlePathChange');
                this.addPathChangeListener('property', this, '_handlePathChange');
                this.addPathChangeListener('object', this, '_handlePathChange');
            }
            this._handlePathChange();
            this.navigationListener = this.eventDispatcherService.addEventListener('hashChange', this._handleNavigation.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._path = '';
            this.eventDispatcherService.removeEventListener('hashChange', this.navigationListener);
        }
    },

    _handleNavigation: {
        value: function(newPath) {
            if (this._path === newPath) {
                this.classList.add("selected");
                this.element.classList.add("selected");
            } else {
                this.classList.remove("selected");
                this.element.classList.remove("selected");
            }
        }
    },

    _handlePathChange: {
        value: function() {
            var parentPath = this.parentCascadingListItem.data.path,
                parentLast = _.last(_.split(parentPath, '/')),
                itemPath =  this.path || this.property || _.kebabCase(this.objectType) ||
                            (this.object ? this.routingService.getURLFromObject(this.object) : '');
            if (parentLast === 'create') {
                this._path = parentPath + '/' + this.object._tmpId;
            } else {
                if (parentLast === _.head(_.split(itemPath, '/'))) {
                    itemPath = _.join(_.drop(_.split(itemPath, '/')), '/');
                }
                this._path =  parentPath + '/' + itemPath;
            }
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
            this.routingService.navigate(this._path);
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
