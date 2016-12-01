/**
 * @module ui/table-nfs.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableNfs
 * @extends Component
 */
exports.TableNfs = Component.specialize(/** @lends TableNfs# */ {
    tableWillUseNewEntry: {
        value: function () {
            var shareService = this.application.shareService;

            return shareService.createNfsShare().then(function (share) {
                return shareService.populateShareObjectIfNeeded(share);
            });
        }
    }
});
