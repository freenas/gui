var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delege").AbstractComponentActionDelegate;

/**
 * @class MainNavigation
 * @extends Component
 */
exports.MainNavigation = AbstractComponentActionDelegate.specialize({

    handlePreferencesAction: {
        value: function () {
            this.application.section = 'preferences';
        }
    }

});
