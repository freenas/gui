/**
 * @module ui/drawer.reel
 */
var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delege").AbstractComponentActionDelegate,
    WidgetWrapper = require("ui/dashboard/widgets/widget-wrapper.reel").WidgetWrapper,
    DrawerItem = require("ui/drawer.reel/drawer-item.reel").DrawerItem,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Drawer
 * @extends Component
 */
exports.Drawer = AbstractDropZoneComponent.specialize(/** @lends Drawer# */ {

    enterDocument: {
        value: function (isFirstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, isFirstTime);
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);

            if (!this.applicationContext && !this._loadingPromise) {
                var self = this;

                this._loadingPromise = Promise.all([
                    this.application.applicationContextService.get(),
                    this.application.widgetService.getAvailableWidgets()
                ]).then(function (arguments) {
                    var applicationContext = arguments[0],
                        availableWidgets = arguments[1];

                    self.items = availableWidgets.toArray();
                    self.userWidgets = applicationContext.dashboardContext.widgets;

                    self.addRangeAtPathChangeListener("userWidgets", self, "_handleUserWidgetsChange");
                }).finally(function () {
                    self._loadingPromise = null;
                });
            }
        }
    },

    exitDocument: {
        value: function () {
            AbstractDropZoneComponent.prototype.exitDocument.call(this);
            AbstractComponentActionDelegate.prototype.exitDocument.call(this);

            this._unToggledCurrentDrawerItemIfNeeded();
        }
    },

    handleInfoToggleAction: {
        value: function (event) {
            var iteration = this._drawerItems._findIterationContainingElement(event.target.element);

            if (iteration) {
                var component,
                    i = 0;

                while ((component = iteration._childComponents[i++])) {
                    if (component instanceof DrawerItem) {
                        component.hasToggled = !component.hasToggled;

                        if (component.hasToggled && this._previousToggledDrawerItem && this._previousToggledDrawerItem !== component) {
                            this._previousToggledDrawerItem.hasToggled = false;
                        }

                        this._previousToggledDrawerItem = component;
                        break;
                    }
                }
            }
        }
    },

    handleCloseButtonAction: {
        value: function () {
            this.application.isDrawerOpen = false;
            this._unToggledCurrentDrawerItemIfNeeded();
        }
    },

    _unToggledCurrentDrawerItemIfNeeded: {
        value: function () {
            if (this._previousToggledDrawerItem) {
                this._previousToggledDrawerItem.hasToggled = false;
            }
        }
    },

    _handleUserWidgetsChange: {
        value: function (plus, minus) {
            var index, i, length;

            if (plus && (length = plus.length)) {
                for (i = 0; i < length; i++) {
                    if ((index = this.items.indexOf(plus[i])) > -1) {
                        this.items.splice(index, 1);
                    }
                }
            }

            if (minus && (length = minus.length)) {
                for (i = 0; i < length; i++) {
                    this.items.push(minus[i]);
                }
            }
        }
    },

    shouldAcceptComponent: {
        value: function (widgetWrapperComponent) {
            return this.userWidgets && widgetWrapperComponent instanceof WidgetWrapper;
        }
    },

    handleComponentDrop: {
        value: function (widgetWrapperComponent) {
            var index;

            if ((index = this.userWidgets.indexOf(widgetWrapperComponent.object)) > -1) {
                this.userWidgets.splice(index, 1);
            }
        }
    }

});
