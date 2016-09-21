var Montage = require("montage").Montage;

exports.VmConfigNetworkAnonymous = Montage.specialize({
    _management: {
        value: null
    },
    management: {
        set: function (value) {
            if (this._management !== value) {
                this._management = value;
            }
        },
        get: function () {
            return this._management;
        }
    },
    _nat: {
        value: null
    },
    nat: {
        set: function (value) {
            if (this._nat !== value) {
                this._nat = value;
            }
        },
        get: function () {
            return this._nat;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "management",
            valueType: "String"
        }, {
            mandatory: false,
            name: "nat",
            valueType: "String"
        }]
    }
});
