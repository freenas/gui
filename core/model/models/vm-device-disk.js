var Montage = require("montage").Montage;

exports.VmDeviceDisk = Montage.specialize({
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
    _mode: {
        value: null
    },
    mode: {
        set: function (value) {
            if (this._mode !== value) {
                this._mode = value;
            }
        },
        get: function () {
            return this._mode;
        }
    },
    _size: {
        value: null
    },
    size: {
        set: function (value) {
            if (this._size !== value) {
                this._size = value;
            }
        },
        get: function () {
            return this._size;
        }
    },
    _source: {
        value: null
    },
    source: {
        set: function (value) {
            if (this._source !== value) {
                this._source = value;
            }
        },
        get: function () {
            return this._source;
        }
    },
    _target_path: {
        value: null
    },
    target_path: {
        set: function (value) {
            if (this._target_path !== value) {
                this._target_path = value;
            }
        },
        get: function () {
            return this._target_path;
        }
    },
    _target_type: {
        value: null
    },
    target_type: {
        set: function (value) {
            if (this._target_type !== value) {
                this._target_type = value;
            }
        },
        get: function () {
            return this._target_type;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: true,
            name: "%type"
        }, {
            mandatory: true,
            name: "mode",
            valueObjectPrototypeName: "VmDeviceDiskMode",
            valueType: "object"
        }, {
            mandatory: false,
            name: "size",
            valueType: "number"
        }, {
            mandatory: true,
            name: "source",
            valueType: "String"
        }, {
            mandatory: true,
            name: "target_path",
            valueType: "String"
        }, {
            mandatory: true,
            name: "target_type",
            valueObjectPrototypeName: "VmDeviceDiskTargetType",
            valueType: "object"
        }]
    }
});
