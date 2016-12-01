/**
 * @module ui/share.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Share
 * @extends Component
 */
exports.Share = Component.specialize(/** @lends Share# */ {

    templateDidLoad: {
        value: function () {
            this._sectionService = this.context.sectionService;
        }
    },

    context: {
        value: null
    },

    _getCurrentVolume: {
        value: function () {}
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            //todo: add created users
            this._sectionService.listUsers().then(function (users) {
                self.users = users;
            });

            if (this.object._isNew) {
                this._clearTables();
                // this object won't be saved,
                // only the object in object.__shares.
                this.object._isNew = false;
            }
        }
    },

    _clearTables: {
        value: function () {
            if (this._afpTable.values) {
                this._afpTable.values.clear();
            }

            if (this._smbTable.values) {
                this._smbTable.values.clear();
            }

            if (this._nfsTable.values) {
                this._nfsTable.values.clear();
            }

            if (this._iscsiTable.values) {
                this._iscsiTable.values.clear();
            }
        }
    }
});
