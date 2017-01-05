var Montage = require("montage").Montage;

exports.AccountCategory = Montage.specialize({
    _user: {
        value: null
    },
    user: {
        set: function (value) {
            if (this._user !== value) {
                this._user = value;
            }
        },
        get: function () {
            return this._user;
        }
    },
    _group: {
        value: null
    },
    group: {
        set: function (value) {
            if (this._group !== value) {
                this._group = value;
            }
        },
        get: function () {
            return this._group;
        }
    },
    _system: {
        value: null
    },
    system: {
        set: function (value) {
            if (this._system !== value) {
                this._system = value;
            }
        },
        get: function () {
            return this._system;
        }
    },
    _directoryService: {
        value: null
    },
    directoryService: {
        set: function (value) {
            if (this._directoryService !== value) {
                this._directoryService = value;
            }
        },
        get: function () {
            return this._directoryService;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "user"
        }, {
            mandatory: false,
            name: "group"
        }, {
            mandatory: false,
            name: "system"
        }, {
            mandatory: false,
            name: "directoryService"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/account-category.reel'
            },
            nameExpression: "'Accounts'"
        }
    }
});
