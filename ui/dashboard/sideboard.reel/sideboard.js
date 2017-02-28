var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class Sideboard
 * @extends Component
 */
exports.Sideboard = AbstractComponentActionDelegate.specialize({
    enterDocument: {
        value: function (isFirstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);
        }
    },

    isCollapsed: {
        value: false
    },

    handleToggleSideboardAction: {
        value: function () {
            this.isCollapsed = !this.isCollapsed;
        }
    }

});
