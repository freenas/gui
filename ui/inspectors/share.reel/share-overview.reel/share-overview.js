var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delege").AbstractComponentActionDelegate;

/**
 * @class ShareOverview
 * @extends Component
 */
exports.ShareOverview = AbstractComponentActionDelegate.specialize(/** @lends ShareOverview# */{
    showTargetTypes: {
        value: false
    },

    handleDisplayPossibleTargetTypesAction: {
        value: function() {
            this.showTargetTypes = !this.showTargetTypes;
        }
    },

    handlePossibleTargetTypeButtonAction: {
        value: function (event) {
            this.targetType = event.target.label;
            this.showTargetTypes = false;
        }
    }
});
