var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkStatusDnsAnonymous = AbstractModel.specialize({
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
    _search: {
        value: null
    },
    search: {
        set: function (value) {
            if (this._search !== value) {
                this._search = value;
            }
        },
        get: function () {
            return this._search;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "addresses",
            valueObjectPrototypeName: "IpAddress",
            valueType: "array"
        }, {
            mandatory: false,
            name: "search",
            valueType: "array"
        }]
    }
});
