var Montage = require("montage").Montage;

exports.NetworkInterfaceAlias = Montage.specialize({
    _address: {
        value: null
    },
    address: {
        set: function (value) {
            if (this._address !== value) {
                this._address = value;
            }
        },
        get: function () {
            return this._address;
        }
    },
    _broadcast: {
        value: null
    },
    broadcast: {
        set: function (value) {
            if (this._broadcast !== value) {
                this._broadcast = value;
            }
        },
        get: function () {
            return this._broadcast;
        }
    },
    _netmask: {
        value: null
    },
    netmask: {
        set: function (value) {
            if (this._netmask !== value) {
                this._netmask = value;
            }
        },
        get: function () {
            return this._netmask;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "address",
            valueObjectPrototypeName: "IpAddress",
            valueType: "object"
        }, {
            mandatory: false,
            name: "broadcast",
            valueObjectPrototypeName: "Ipv4Address",
            valueType: "object"
        }, {
            mandatory: false,
            name: "netmask",
            valueType: "number"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "NetworkInterfaceAliasType",
            valueType: "object"
        }]
    }
});
