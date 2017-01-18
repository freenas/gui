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
    
    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._systemService = this.application.systemService;
            }
        }
    },

    handleAddAction: {
        value: function () {
            // return this._systemService.addDiskToBootPool(this.table.selectedRow.object.path);
            this.table.showNewEntryRow();
        }
    }
});
