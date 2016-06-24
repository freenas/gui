var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkHost = AbstractModel.specialize({
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
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
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
            name: "id",
            valueType: "String"
        }]
    }
});
