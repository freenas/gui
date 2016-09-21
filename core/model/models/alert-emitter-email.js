var Montage = require("montage").Montage;

exports.AlertEmitterEmail = Montage.specialize({
    _addresses: {
        value: null
    },
    addresses: {
        set: function (value) {
            if (this._addresses !== value) {
                this._addresses = value;
            }
        },
        get: function () {
            return this._addresses;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "addresses",
            valueType: "array"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
