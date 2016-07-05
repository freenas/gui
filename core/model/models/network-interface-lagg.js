var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkInterfaceLagg = AbstractModel.specialize({
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
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/lagg.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/lagg.reel'
            },
            nameExpression: "!!id ? status.name : 'New ' + type"
        }
    }
});
