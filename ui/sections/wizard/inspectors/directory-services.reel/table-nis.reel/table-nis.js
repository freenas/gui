/**
 * @module ui/table-nis.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableNis
 * @extends Component
 */
exports.TableNis = Component.specialize(/** @lends TableNis# */ {
    tableWillUseNewEntry: {
        value: function () {
            return this._sectionService.getNewDirectoryForType("nis");
        }
    }
});
