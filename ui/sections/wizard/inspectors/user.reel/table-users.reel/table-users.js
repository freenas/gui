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
    }
    //TODO: password checking.
});
