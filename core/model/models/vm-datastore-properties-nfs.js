var Montage = require("montage").Montage;

exports.VmDatastorePropertiesNfs = Montage.specialize({
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
    _path: {
        value: null
    },
    path: {
        set: function (value) {
            if (this._path !== value) {
                this._path = value;
            }
        },
        get: function () {
            return this._path;
        }
    },
    _version: {
        value: null
    },
    version: {
        set: function (value) {
            if (this._version !== value) {
                this._version = value;
            }
        },
        get: function () {
            return this._version;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "version",
            valueObjectPrototypeName: "VmDatastoreNfsVersion",
            valueType: "object"
        }]
    }
});
