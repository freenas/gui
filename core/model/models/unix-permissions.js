var Montage = require("montage").Montage;

exports.UnixPermissions = Montage.specialize({
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
    _others: {
        value: null
    },
    others: {
        set: function (value) {
            if (this._others !== value) {
                this._others = value;
            }
        },
        get: function () {
            return this._others;
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
    },
    _value: {
        value: null
    },
    value: {
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
            }
        },
        get: function () {
            return this._value;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "group",
            valueObjectPrototypeName: "UnixModeTuple",
            valueType: "object"
        }, {
            mandatory: false,
            name: "others",
            valueObjectPrototypeName: "UnixModeTuple",
            valueType: "object"
        }, {
            mandatory: false,
            name: "user",
            valueObjectPrototypeName: "UnixModeTuple",
            valueType: "object"
        }, {
            mandatory: false,
            name: "value",
            valueType: "number"
        }]
    }
});
