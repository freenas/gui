var Montage = require("montage").Montage;

exports.ShareIscsi = Montage.specialize({
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
    _available_space_threshold: {
        value: null
    },
    available_space_threshold: {
        set: function (value) {
            if (this._available_space_threshold !== value) {
                this._available_space_threshold = value;
            }
        },
        get: function () {
            return this._available_space_threshold;
        }
    },
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
    _ctl_lun: {
        value: null
    },
    ctl_lun: {
        set: function (value) {
            if (this._ctl_lun !== value) {
                this._ctl_lun = value;
            }
        },
        get: function () {
            return this._ctl_lun;
        }
    },
    _device_id: {
        value: null
    },
    device_id: {
        set: function (value) {
            if (this._device_id !== value) {
                this._device_id = value;
            }
        },
        get: function () {
            return this._device_id;
        }
    },
    _naa: {
        value: null
    },
    naa: {
        set: function (value) {
            if (this._naa !== value) {
                this._naa = value;
            }
        },
        get: function () {
            return this._naa;
        }
    },
    _physical_block_size: {
        value: null
    },
    physical_block_size: {
        set: function (value) {
            if (this._physical_block_size !== value) {
                this._physical_block_size = value;
            }
        },
        get: function () {
            return this._physical_block_size;
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
    _tpc: {
        value: null
    },
    tpc: {
        set: function (value) {
            if (this._tpc !== value) {
                this._tpc = value;
            }
        },
        get: function () {
            return this._tpc;
        }
    },
    _vendor_id: {
        value: null
    },
    vendor_id: {
        set: function (value) {
            if (this._vendor_id !== value) {
                this._vendor_id = value;
            }
        },
        get: function () {
            return this._vendor_id;
        }
    },
    _xen_compat: {
        value: null
    },
    xen_compat: {
        set: function (value) {
            if (this._xen_compat !== value) {
                this._xen_compat = value;
            }
        },
        get: function () {
            return this._xen_compat;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "available_space_threshold",
            valueType: "number"
        }, {
            mandatory: false,
            name: "block_size",
            valueObjectPrototypeName: "ShareIscsiBlocksize",
            valueType: "object"
        }, {
            mandatory: false,
            name: "ctl_lun",
            valueType: "number"
        }, {
            mandatory: false,
            name: "device_id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "naa",
            valueType: "String"
        }, {
            mandatory: false,
            name: "physical_block_size",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "read_only",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "rpm",
            valueObjectPrototypeName: "ShareIscsiRpm",
            valueType: "object"
        }, {
            mandatory: false,
            name: "serial",
            valueType: "String"
        }, {
            mandatory: false,
            name: "size",
            valueType: "number"
        }, {
            mandatory: false,
            name: "tpc",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "vendor_id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "xen_compat",
            valueType: "boolean"
        }]
    }
});
