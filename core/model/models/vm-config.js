var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmConfig = AbstractModel.specialize({
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
