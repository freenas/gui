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
    },

    prepareForActivationEvents: {
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
