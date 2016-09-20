var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkInterfaceLaggAnonymous = AbstractModel.specialize({
    _ports: {
        value: null
    },
    ports: {
        set: function (value) {
            if (this._ports !== value) {
                this._ports = value;
            }
        },
        get: function () {
            return this._ports;
        }
    },
    _protocol: {
        value: null
    },
    protocol: {
        set: function (value) {
            if (this._protocol !== value) {
                this._protocol = value;
            }
        },
        get: function () {
            return this._protocol;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "ports",
            valueType: "array"
        }, {
            mandatory: false,
            name: "protocol",
            valueObjectPrototypeName: "NetworkAggregationProtocols",
            valueType: "object"
        }]
    }
});
