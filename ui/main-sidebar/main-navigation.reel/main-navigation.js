var Component = require("montage/ui/component").Component;

/**
 * @class MainNavigation
 * @extends Component
 */
exports.MainNavigation = Component.specialize({
    handlePreferencesAction: {
        value: function() {
            this.application.section = 'preferences';
        }
    }
});

// FIXME: Selection needs to be managed by a selection controller
