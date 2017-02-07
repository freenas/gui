/**
 * @module ui/table-ldap.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableLdap
 * @extends Component
 */
exports.TableLdap = Component.specialize(/** @lends TableLdap# */ {
    tableWillUseNewEntry: {
        value: function () {
            return this._sectionService.getNewDirectoryForType("ldap");
        }
    }
});
