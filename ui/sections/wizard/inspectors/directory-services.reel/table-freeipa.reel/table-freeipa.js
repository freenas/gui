/**
 * @module ui/table-freeipa.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableFreeipa
 * @extends Component
 */
exports.TableFreeipa = Component.specialize(/** @lends TableFreeipa# */ {

    tableWillUseNewEntry: {
        value: function () {
            return this._sectionService.getNewDirectoryForType("freeipa");
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
