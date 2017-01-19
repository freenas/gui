/**
 * @module ui/boot-pool-topology-table.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class BootPoolTopologyTable
 * @extends Component
 */
exports.BootPoolTopologyTable = Component.specialize({

    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
        }
    },
    
    handleAddAction: {
        value: function() {
            this._selectedRow = null;
            this.table.showNewEntryRow();
        }
    },

    handleReplaceAction: {
        value: function() {
            this._selectedRow = this.table.selectedRows[0];
            this.table.showNewEntryRow();
        }
    },

    tableWillAddNewEntry: {
        value: function(table, object) {
            this.callDelegateMethod('didRequestAddDisk', object, this._selectedRow ? this._selectedRow.object : null);
            return false;
        }
    }
});
