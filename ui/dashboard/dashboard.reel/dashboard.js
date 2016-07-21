var Component = require("montage/ui/component").Component;

/**
 * @class Dashboard
 * @extends Component
 */
exports.Dashboard = Component.specialize({

    enterDocument: {
        value: function () {
            if (!this.applicationContext) {
                var self = this;

                this.application.applicationContextService.get().then(function (applicationContext) {
                    self.applicationContext = applicationContext;
                });
            }
        }
    },

    exitDocument: {
        value: function () {
            this.application.isDrawerOpen = false;
        }
    }

});
