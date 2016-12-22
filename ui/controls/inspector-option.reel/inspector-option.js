var Button = require("montage/ui/button.reel").Button,
    RoutingService = require("core/service/routing-service").RoutingService,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

exports.InspectorOption = Button.specialize({

    hasTemplate: {
        value: true
    },

    _parentCascadingListItem: {
        value: null
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
        value: function () {
            var self = this;
/*
            this.getSelectionKey(this.object).then(function(selectionKey) {
                self.selectionKey = selectionKey;
            });
            this.pathChangeListener = this.routingService.subscribe('path', this.handlePathChange.bind(this));
            this.handlePathChange();
*/
        }
    },

    exitDocument: {
        value: function () {
/*
            this.routingService.unsubscribe(this.pathChangeListener);
            if (this.element.classList.contains("selected")) {
                this.classList.remove("selected");
                this.element.classList.remove("selected");
            }
*/
        }
    },

    getSelectionKey: {
        value: function (object) {
            var result = this.property;
            if (!result && object) {
                object._objectType = this.objectType || object._objectType;
                result = this.routingService.getKeyFromObject(object);
            }
            return Promise.resolve(result);
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

    handleSelectionChange: {
        value: function () {
            if (this.selectionKey && this.parentCascadingListItem && this.parentCascadingListItem.selectedKey === this.selectionKey ) {
                this.classList.add("selected");
                this.element.classList.add("selected");
            } else {
                this.classList.remove("selected");
                this.element.classList.remove("selected");
            }
        }
    },

    __handlePress: {
        value: function () {
            this.active = false;
            if (this.object) {
                this.parentCascadingListItem.selectObject(this.object);
            } else if (this.property) {
                this.parentCascadingListItem.selectProperty(this.property);
            }
            this.classList.add("selected");
            this.element.classList.add("selected");
            this._removeEventListeners();
        }
    }

});
