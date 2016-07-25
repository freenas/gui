/**
 * @module ui/drawer.reel
 */
var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    WidgetWrapper = require("ui/dashboard/widgets/widget-wrapper.reel").WidgetWrapper,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Drawer
 * @extends Component
 */
exports.Drawer = AbstractDropZoneComponent.specialize(/** @lends Drawer# */ {

    enterDocument: {
        value: function (isFirstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, isFirstTime);

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
