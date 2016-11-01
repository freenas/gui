/**
 * @module ui/table-container-default-header.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableContainerDefaultHeader
 * @extends Component
 */
exports.TableContainerDefaultHeader = Component.specialize(/** @lends TableContainerDefaultHeader# */ {

    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.table.showNewEntryRow();
        }
    },

    handleDeleteButtonAction: {
        value: function () {
            this.table.selectedRows.forEach(function(row) {
                row.object.status = 'd';
            });
            this.table.deleteSelectedRows();
        }
    }

});
