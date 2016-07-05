var Component = require("montage/ui/component").Component;

/**
 * @class IScsiService
 * @extends Component
 */
exports.IScsiService = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                if (this.object.pool_space_threshold === null) {
                    this.object.pool_space_threshold = 90;
                }
            }
        }
    }
});
