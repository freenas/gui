var Component = require("montage/ui/component").Component;

/**
 * @class IscsiService
 * @extends Component
 */
exports.IscsiService = Component.specialize({
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
