var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    DrawerItem = require("ui/drawer.reel/drawer-item.reel").DrawerItem;

/**
 * @class Dashboard
 * @extends Component
 */
exports.Dashboard = AbstractDropZoneComponent.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, isFirstTime);

            if (!this.userWidgets) {
                var self = this;

                this.application.applicationContextService.get().then(function (applicationContext) {
                    self.userWidgets = applicationContext.dashboardContext.widgets;
                });
            }
        }
    },

    exitDocument: {
        value: function () {
            this.application.isDrawerOpen = false;
        }
    },

    shouldAcceptComponent: {
        value: function (drawerItemComponent) {
            return this.userWidgets && drawerItemComponent instanceof DrawerItem;
        }
    },

    handleComponentDrop: {
        value: function (drawerItemComponent) {
            if (this.userWidgets.indexOf(drawerItemComponent.object) === -1) {
                this.userWidgets.push(drawerItemComponent.object);
            }
        }
    }

});
