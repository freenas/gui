/**
 * @module ui/table-afp.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableAfp
 * @extends Component
 */
exports.TableAfp = Component.specialize(/** @lends TableAfp# */ {

    tableWillUseNewEntry: {
        value: function () {
            var shareService = this.application.shareService;

            return shareService.createAfpShare().then(function (share) {
                return shareService.populateShareObjectIfNeeded(share);
            });
        }
    }

});
