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
    },
    enterDocument: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    exitDocument: {
        value: function() {
            this.removeEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.table.showNewEntryRow();
        }
    }
});
