var Montage = require("montage").Montage;

exports.ServiceDc = Montage.specialize({
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
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
    _vm_id: {
        value: null
    },
    vm_id: {
        set: function (value) {
            if (this._vm_id !== value) {
                this._vm_id = value;
            }
        },
        get: function () {
            return this._vm_id;
        }
    },
    _volume: {
        value: null
    },
    volume: {
        set: function (value) {
            if (this._volume !== value) {
                this._volume = value;
            }
        },
        get: function () {
            return this._volume;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "vm_id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "volume",
            valueType: "String"
        }]
    }
});
