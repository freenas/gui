var Montage = require("montage").Montage;

exports.VmHwCapabilites = Montage.specialize({
    _svm_features: {
        value: null
    },
    svm_features: {
        set: function (value) {
            if (this._svm_features !== value) {
                this._svm_features = value;
            }
        },
        get: function () {
            return this._svm_features;
        }
    },
    _unrestricted_guest: {
        value: null
    },
    unrestricted_guest: {
        set: function (value) {
            if (this._unrestricted_guest !== value) {
                this._unrestricted_guest = value;
            }
        },
        get: function () {
            return this._unrestricted_guest;
        }
    },
    _vtx_enabled: {
        value: null
    },
    vtx_enabled: {
        set: function (value) {
            if (this._vtx_enabled !== value) {
                this._vtx_enabled = value;
            }
        },
        get: function () {
            return this._vtx_enabled;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "svm_features",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "unrestricted_guest",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "vtx_enabled",
            valueType: "boolean"
        }]
    }
});
