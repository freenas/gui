var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.AccountDirectoryServices = AbstractModel.specialize({
    _activeDirectory: {
        value: null
    },
    activeDirectory: {
        set: function (value) {
            if (this._activeDirectory !== value) {
                this._activeDirectory = value;
            }
        },
        get: function () {
            return this._activeDirectory;
        }
    },
    _ldap: {
        value: null
    },
    ldap: {
        set: function (value) {
            if (this._ldap !== value) {
                this._ldap = value;
            }
        },
        get: function () {
            return this._ldap;
        }
    },
    _nis: {
        value: null
    },
    nis: {
        set: function (value) {
            if (this._nis !== value) {
                this._nis = value;
            }
        },
        get: function () {
            return this._nis;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "activeDirectory"
        }, {
            mandatory: false,
            name: "ldap"
        }, {
            mandatory: false,
            name: "nis"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/account-directory-services.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/freenas-icon.reel'
            },
            nameExpression: "'Directory Services'"
        }
    }
});
