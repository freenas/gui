/**
 * @module ui/table-smb.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableSmb
 * @extends Component
 */
exports.TableSmb = Component.specialize(/** @lends TableSmb# */ {
    tableWillUseNewEntry: {
        value: function () {
            var shareService = this.application.shareService;

            return shareService.createSmbShare().then(function (share) {
                return shareService.populateShareObjectIfNeeded(share);
            });
        }
    }
});
