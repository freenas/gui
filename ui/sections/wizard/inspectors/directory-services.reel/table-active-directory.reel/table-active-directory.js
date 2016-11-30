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
    }

});
