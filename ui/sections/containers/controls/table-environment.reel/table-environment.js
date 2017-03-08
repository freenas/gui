/**
 * @module ui/table-environment.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableEnvironment
 * @extends Component
 */
exports.TableEnvironment = Component.specialize({
    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.table.showNewEntryRow();
        }
    }
});
