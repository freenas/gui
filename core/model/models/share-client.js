var Montage = require("montage").Montage;

exports.ShareClient = Montage.specialize({
    _connected_at: {
        value: null
    },
    connected_at: {
        set: function (value) {
            if (this._connected_at !== value) {
                this._connected_at = value;
            }
        },
        get: function () {
            return this._connected_at;
        }
    },
    _extra: {
        value: null
    },
    extra: {
        set: function (value) {
            if (this._extra !== value) {
                this._extra = value;
            }
        },
        get: function () {
            return this._extra;
        }
    },
    _host: {
        value: null
    },
    host: {
        set: function (value) {
            if (this._host !== value) {
                this._host = value;
            }
        },
        get: function () {
            return this._host;
        }
    },
    _share: {
        value: null
    },
    share: {
        set: function (value) {
            if (this._share !== value) {
                this._share = value;
            }
        },
        get: function () {
            return this._share;
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
            name: "connected_at",
            valueType: "String"
        }, {
            mandatory: false,
            name: "extra",
            valueType: "object"
        }, {
            mandatory: false,
            name: "host",
            valueType: "String"
        }, {
            mandatory: false,
            name: "share",
            valueType: "String"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }]
    }
});
