var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.BackupSsh = AbstractModel.specialize({
    _directory: {
        value: null
    },
    directory: {
        set: function (value) {
            if (this._directory !== value) {
                this._directory = value;
            }
        },
        get: function () {
            return this._directory;
        }
    },
    _hostkey: {
        value: null
    },
    hostkey: {
        set: function (value) {
            if (this._hostkey !== value) {
                this._hostkey = value;
            }
        },
        get: function () {
            return this._hostkey;
        }
    },
    _hostport: {
        value: null
    },
    hostport: {
        set: function (value) {
            if (this._hostport !== value) {
                this._hostport = value;
            }
        },
        get: function () {
            return this._hostport;
        }
    },
    _password: {
        value: null
    },
    password: {
        set: function (value) {
            if (this._password !== value) {
                this._password = value;
            }
        },
        get: function () {
            return this._password;
        }
    },
    _privkey: {
        value: null
    },
    privkey: {
        set: function (value) {
            if (this._privkey !== value) {
                this._privkey = value;
            }
        },
        get: function () {
            return this._privkey;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    },
    _username: {
        value: null
    },
    username: {
        set: function (value) {
            if (this._username !== value) {
                this._username = value;
            }
        },
        get: function () {
            return this._username;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "directory",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostkey",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostport",
            valueType: "String"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "privkey",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
