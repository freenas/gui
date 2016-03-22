var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = Component.specialize({
    emptyShares: {
        value: null
    },

    emptySnapshots: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.emptyShares = this.application.dataService.getEmptyCollectionForType(Model.Share);
                this.emptySnapshots = this.application.dataService.getEmptyCollectionForType(Model.VolumeSnapshot);
            }
        }
    }
});
