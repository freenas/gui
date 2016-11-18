var Montage = require("montage").Montage;

exports.Mail = Montage.specialize({
    _auth: {
        value: null
    },
    auth: {
        set: function (value) {
            if (this._auth !== value) {
                this._auth = value;
            }
        },
        get: function () {
            return this._auth;
        }
    },
    _encryption: {
        value: null
    },
    encryption: {
        set: function (value) {
            if (this._encryption !== value) {
                this._encryption = value;
            }
        },
        get: function () {
            return this._encryption;
        }
    },
    _from: {
        value: null
    },
    from: {
        set: function (value) {
            if (this._from !== value) {
                this._from = value;
            }
        },
        get: function () {
            return this._from;
        }
    },
    _pass: {
        value: null
    },
    pass: {
        set: function (value) {
            if (this._pass !== value) {
                this._pass = value;
            }
        },
        get: function () {
            return this._pass;
        }
    },
    _port: {
        value: null
    },
    port: {
        set: function (value) {
            if (this._port !== value) {
                this._port = value;
            }
        },
        get: function () {
            return this._port;
        }
    },
    _server: {
        value: null
    },
    server: {
        set: function (value) {
            if (this._server !== value) {
                this._server = value;
            }
        },
        get: function () {
            return this._server;
        }
    },
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "auth",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "encryption",
            valueObjectPrototypeName: "MailEncryptionType",
            valueType: "object"
        }, {
            mandatory: false,
            name: "from",
            valueType: "String"
        }, {
            mandatory: false,
            name: "pass",
            valueType: "String"
        }, {
            mandatory: false,
            name: "port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "server",
            valueType: "String"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/system/inspectors/alert.reel/mail.reel'
            },
            nameExpression: "'Settings'",
            wizardComponentModuleId: "ui/sections/wizard/inspectors/mail.reel",
            wizardTitle: "Configure your mail settings"
        }
    }
});
