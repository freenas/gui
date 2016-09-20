var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class Dashboard
 * @extends Component
 */
exports.Dashboard = AbstractComponentActionDelegate.specialize({

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
