var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

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
