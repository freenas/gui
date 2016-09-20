var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkInterfaceBridgeAnonymous = AbstractModel.specialize({
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
    }
});
