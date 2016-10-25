var Montage = require("montage").Montage;

exports.VmGuestInfo = Montage.specialize({
    _interfaces: {
        value: null
    },
    interfaces: {
        set: function (value) {
            if (this._interfaces !== value) {
                this._interfaces = value;
            }
        },
        get: function () {
            return this._interfaces;
        }
    },
    _load_avg: {
        value: null
    },
    load_avg: {
        set: function (value) {
            if (this._load_avg !== value) {
                this._load_avg = value;
            }
        },
        get: function () {
            return this._load_avg;
        }
    },
    _time: {
        value: null
    },
    time: {
        set: function (value) {
            if (this._time !== value) {
                this._time = value;
            }
        },
        get: function () {
            return this._time;
        }
    },
    _vm_tools_version: {
        value: null
    },
    vm_tools_version: {
        set: function (value) {
            if (this._vm_tools_version !== value) {
                this._vm_tools_version = value;
            }
        },
        get: function () {
            return this._vm_tools_version;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "interfaces",
            valueType: "object"
        }, {
            mandatory: false,
            name: "load_avg",
            valueType: "array"
        }, {
            mandatory: false,
            name: "time",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "vm_tools_version",
            valueType: "String"
        }]
    }
});
