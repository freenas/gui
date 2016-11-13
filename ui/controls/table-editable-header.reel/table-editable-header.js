/**
 * @module ui/table-container-default-header.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableEditableHeader
 * @extends Component
 */
exports.TableEditableHeader = Component.specialize(/** @lends TableEditableHeader# */ {

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
            this.table.deleteSelectedRows();
        }
    }

});
