var Montage = require("montage").Montage;

exports.Permissions = Montage.specialize({
    _acl: {
        value: null
    },
    acl: {
        set: function (value) {
            if (this._acl !== value) {
                this._acl = value;
            }
        },
        get: function () {
            return this._acl;
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
    _modes: {
        value: null
    },
    modes: {
        set: function (value) {
            if (this._modes !== value) {
                this._modes = value;
            }
        },
        get: function () {
            return this._modes;
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
            name: "acl",
            valueType: "array"
        }, {
            mandatory: false,
            name: "group",
            valueType: "String"
        }, {
            mandatory: false,
            name: "modes",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }]
    }
});
