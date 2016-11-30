/**
 * @module ui/directory-services.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class DirectoryServices
 * @extends Component
 */
var DirectoryServices = exports.DirectoryServices = Component.specialize(/** @lends DirectoryServices# */{

    templateDidLoad: {
        value: function () {
            this._sectionService = this.context.sectionService;
        }
    },

    enterDocument: {
        value: function () {
            if (this.object._isNew) {
                this._clearTables();
                // this object won't be saved,
                // only the object in object.__directoryServices.
                this.object._isNew = false;
            }
        }
    },

    _clearTables: {
        value: function () {
            if (this._nisTable.values) {
                this._nisTable.values.clear();
            }

            if (this._windbindTable.values) {
                this._windbindTable.values.clear();
            }

            if (this._freeipaTable.values) {
                this._freeipaTable.values.clear();
            }

            if (this._ldapTable.values) {
                this._ldapTable.values.clear();
            }
        }
    }

});
