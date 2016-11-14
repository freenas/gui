var Montage = require("montage").Montage;

exports.VmConfig = Montage.specialize({
    _additional_templates: {
        value: null
    },
    additional_templates: {
        set: function (value) {
            if (this._additional_templates !== value) {
                this._additional_templates = value;
            }
        },
        get: function () {
            return this._additional_templates;
        }
    },
    _network: {
        value: null
    },
    network: {
        set: function (value) {
            if (this._network !== value) {
                this._network = value;
            }
        },
        get: function () {
            return this._network;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "additional_templates",
            valueObjectPrototypeName: "VmTemplateSource",
            valueType: "array"
        }, {
            mandatory: false,
            name: "network",
            valueType: "object"
        }]
    }
});
