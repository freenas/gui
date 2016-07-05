var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkInterfaceBridge = AbstractModel.specialize({
    _members: {
        value: null
    },
    members: {
        set: function (value) {
            if (this._members !== value) {
                this._members = value;
            }
        },
        get: function () {
            return this._members;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "members",
            valueType: "array"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/bridge.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/bridge.reel'
            },
            nameExpression: "!!id ? status.name : 'New ' + type"
        }
    }
});
