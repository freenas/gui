var Montage = require("montage").Montage;

exports.UsbDevice = Montage.specialize({
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
    _bus: {
        value: null
    },
    bus: {
        set: function (value) {
            if (this._bus !== value) {
                this._bus = value;
            }
        },
        get: function () {
            return this._bus;
        }
    },
    _class: {
        value: null
    },
    class: {
        set: function (value) {
            if (this._class !== value) {
                this._class = value;
            }
        }, get: function () {
            return this._class;
        }
    },
    _manufacturer: {
        value: null
    },
    manufacturer: {
        set: function (value) {
            if (this._manufacturer !== value) {
                this._manufacturer = value;
            }
        },
        get: function () {
            return this._manufacturer;
        }
    },
    _pid: {
        value: null
    },
    pid: {
        set: function (value) {
            if (this._pid !== value) {
                this._pid = value;
            }
        },
        get: function () {
            return this._pid;
        }
    },
    _product: {
        value: null
    },
    product: {
        set: function (value) {
            if (this._product !== value) {
                this._product = value;
            }
        },
        get: function () {
            return this._product;
        }
    },
    _vid: {
        value: null
    },
    vid: {
        set: function (value) {
            if (this._vid !== value) {
                this._vid = value;
            }
        },
        get: function () {
            return this._vid;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "address",
            valueType: "number"
        }, {
            mandatory: false,
            name: "bus",
            valueType: "number"
        }, {
            mandatory: false,
            name: "class",
            valueType: "number"
        }, {
            mandatory: false,
            name: "manufacturer",
            valueType: "String"
        }, {
            mandatory: false,
            name: "pid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "product",
            valueType: "String"
        }, {
            mandatory: false,
            name: "vid",
            valueType: "number"
        }]
    }
});
