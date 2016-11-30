var Montage = require("montage").Montage;

exports.IscsiTarget = Montage.specialize({
    _address: {
        value: null
    },
    address: {
        set: function (value) {
            if (this._address !== value) {
                this._address = value;
            }
        },
        get: function () {
            return this._address;
        }
    },
    _enabled: {
        value: null
    },
    enabled: {
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
            }
        },
        get: function () {
            return this._enabled;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _mutual_secret: {
        value: null
    },
    mutual_secret: {
        set: function (value) {
            if (this._mutual_secret !== value) {
                this._mutual_secret = value;
            }
        },
        get: function () {
            return this._mutual_secret;
        }
    },
    _mutual_user: {
        value: null
    },
    mutual_user: {
        set: function (value) {
            if (this._mutual_user !== value) {
                this._mutual_user = value;
            }
        },
        get: function () {
            return this._mutual_user;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    },
    _secret: {
        value: null
    },
    secret: {
        set: function (value) {
            if (this._secret !== value) {
                this._secret = value;
            }
        },
        get: function () {
            return this._secret;
        }
    },
    _status: {
        value: null
    },
    status: {
        set: function (value) {
            if (this._status !== value) {
                this._status = value;
            }
        },
        get: function () {
            return this._status;
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
            name: "address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mutual_secret",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mutual_user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "secret",
            valueType: "String"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "IscsiTargetStatus",
            valueType: "object"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }]
    }
});
