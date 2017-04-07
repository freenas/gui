/**
 * @module ui/table-active-directory.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableActiveDirectory
 * @extends Component
 */
exports.TableActiveDirectory = Component.specialize(/** @lends TableActiveDirectory# */ {

    tableWillUseNewEntry: {
        value: function () {
            return this._sectionService.getNewDirectoryForType("winbind");
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
