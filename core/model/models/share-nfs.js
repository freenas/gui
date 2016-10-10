var Montage = require("montage").Montage;

exports.ShareNfs = Montage.specialize({
    "_%type": {
        value: null
    },
    "%type": {
        set: function (value) {
            if (this["_%type"] !== value) {
                this["_%type"] = value;
            }
        },
        get: function () {
            return this["_%type"];
        }
    },
    _alldirs: {
        value: null
    },
    alldirs: {
        set: function (value) {
            if (this._alldirs !== value) {
                this._alldirs = value;
            }
        },
        get: function () {
            return this._alldirs;
        }
    },
    _hosts: {
        value: null
    },
    hosts: {
        set: function (value) {
            if (this._hosts !== value) {
                this._hosts = value;
            }
        },
        get: function () {
            return this._hosts;
        }
    },
    _mapall_group: {
        value: null
    },
    mapall_group: {
        set: function (value) {
            if (this._mapall_group !== value) {
                this._mapall_group = value;
            }
        },
        get: function () {
            return this._mapall_group;
        }
    },
    _mapall_user: {
        value: null
    },
    mapall_user: {
        set: function (value) {
            if (this._mapall_user !== value) {
                this._mapall_user = value;
            }
        },
        get: function () {
            return this._mapall_user;
        }
    },
    _maproot_group: {
        value: null
    },
    maproot_group: {
        set: function (value) {
            if (this._maproot_group !== value) {
                this._maproot_group = value;
            }
        },
        get: function () {
            return this._maproot_group;
        }
    },
    _maproot_user: {
        value: null
    },
    maproot_user: {
        set: function (value) {
            if (this._maproot_user !== value) {
                this._maproot_user = value;
            }
        },
        get: function () {
            return this._maproot_user;
        }
    },
    _read_only: {
        value: null
    },
    read_only: {
        set: function (value) {
            if (this._read_only !== value) {
                this._read_only = value;
            }
        },
        get: function () {
            return this._read_only;
        }
    },
    _security: {
        value: null
    },
    security: {
        set: function (value) {
            if (this._security !== value) {
                this._security = value;
            }
        },
        get: function () {
            return this._security;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "alldirs",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "hosts",
            valueType: "array"
        }, {
            mandatory: false,
            name: "mapall_group",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mapall_user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "maproot_group",
            valueType: "String"
        }, {
            mandatory: false,
            name: "maproot_user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "read_only",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "security",
            valueObjectPrototypeName: "ShareNfsSecurityItems",
            valueType: "array"
        }]
    }
});
