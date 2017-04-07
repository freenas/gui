/**
 * @module ui/table-users.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableUsers
 * @extends Component
 */
exports.TableUsers = Component.specialize(/** @lends TableUsers# */ {
    tableWillUseNewEntry: {
        value: function () {
            return this._sectionService.getNewUser();
        }
    },
    //TODO: password checking.
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
