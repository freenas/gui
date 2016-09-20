var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkInterfaceCapabilitiesAnonymous = AbstractModel.specialize({
    _add: {
        value: null
    },
    add: {
        set: function (value) {
            if (this._add !== value) {
                this._add = value;
            }
        },
        get: function () {
            return this._add;
        }
    },
    _del: {
        value: null
    },
    del: {
        set: function (value) {
            if (this._del !== value) {
                this._del = value;
            }
        },
        get: function () {
            return this._del;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "add",
            valueObjectPrototypeName: "NetworkInterfaceCapabilities",
            valueType: "object"
        }, {
            mandatory: false,
            name: "del",
            valueObjectPrototypeName: "NetworkInterfaceCapabilities",
            valueType: "object"
        }]
    }
});
