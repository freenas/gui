var Montage = require("montage").Montage;

exports.VmConfig = Montage.specialize({
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
            name: "network",
            valueType: "object"
        }]
    }
});
