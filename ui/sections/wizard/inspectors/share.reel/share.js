var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Share = AbstractInspector.specialize(/** @lends Share# */ {

    context: {
        value: null
    },

    _getCurrentVolume: {
        value: function () {}
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            this._sectionService.listUsers().then(function (users) {
                if (!self.context.previousStep.isSkipped) {
                    self.users = users.concat(self.context.previousStep.object.__users);
                } else {
                    self.users = users;
                }
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
