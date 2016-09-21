var Montage = require("montage").Montage;

exports.SimulatorDisk = Montage.specialize({
    _block_size: {
        value: null
    },
    block_size: {
        set: function (value) {
            if (this._block_size !== value) {
                this._block_size = value;
            }
        },
        get: function () {
            return this._block_size;
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
    _mediasize: {
        value: null
    },
    mediasize: {
        set: function (value) {
            if (this._mediasize !== value) {
                this._mediasize = value;
            }
        },
        get: function () {
            return this._mediasize;
        }
    },
    _model: {
        value: null
    },
    model: {
        set: function (value) {
            if (this._model !== value) {
                this._model = value;
            }
        },
        get: function () {
            return this._model;
        }
    },
    _online: {
        value: null
    },
    online: {
        set: function (value) {
            if (this._online !== value) {
                this._online = value;
            }
        },
        get: function () {
            return this._online;
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
    _rpm: {
        value: null
    },
    rpm: {
        set: function (value) {
            if (this._rpm !== value) {
                this._rpm = value;
            }
        },
        get: function () {
            return this._rpm;
        }
    },
    _serial: {
        value: null
    },
    serial: {
        set: function (value) {
            if (this._serial !== value) {
                this._serial = value;
            }
        },
        get: function () {
            return this._serial;
        }
    },
    _vendor: {
        value: null
    },
    vendor: {
        set: function (value) {
            if (this._vendor !== value) {
                this._vendor = value;
            }
        },
        get: function () {
            return this._vendor;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "block_size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mediasize",
            valueType: "number"
        }, {
            mandatory: false,
            name: "model",
            valueType: "String"
        }, {
            mandatory: false,
            name: "online",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "rpm",
            valueObjectPrototypeName: "SimulatorDiskRpm",
            valueType: "object"
        }, {
            mandatory: false,
            name: "serial",
            valueType: "String"
        }, {
            mandatory: false,
            name: "vendor",
            valueType: "String"
        }]
    }
});
