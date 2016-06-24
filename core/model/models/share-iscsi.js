var Montage = require("montage/core/core").Montage;

exports.ShareIscsi = Montage.specialize({
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
    }
});
