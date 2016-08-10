var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class Dashboard
 * @extends Component
 */
exports.Dashboard = AbstractComponentActionDelegate.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);

            if (isFirstTime) {
                var self = this;

                window.nativeAddEventListener("beforeunload", function () {
                    self.application.applicationContextService.save();
                });
            }
        }
    },

    exitDocument: {
        value: function () {
            AbstractComponentActionDelegate.prototype.exitDocument.call(this);

            this.application.isDrawerOpen = false;
        }
    },

    handleOpenDrawerButtonAction: {
        value: function () {
            this.application.isDrawerOpen = true;
        }
    }

});
