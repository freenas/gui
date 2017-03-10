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
