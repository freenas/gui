var Component = require("montage/ui/component").Component;

/**
 * @class ShareOverview
 * @extends Component
 */
exports.ShareOverview = Component.specialize(/** @lends ShareOverview# */{
    showTargetTypes: {
        value: false
    },

    handleDisplayPossibleTargetTypesAction: {
        value: function() {
            this.showTargetTypes = !this.showTargetTypes;
        }
    },

    handlePossibleTargetTypeButtonAction: {
        value: function(event) {
            this.targetType = event.target.value;
            this.showTargetTypes = false;
        }
    }
});
