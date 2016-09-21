var Montage = require("montage").Montage;

exports.NetworkRoute = Montage.specialize({
    _gateway: {
        value: null
    },
    gateway: {
        set: function (value) {
            if (this._gateway !== value) {
                this._gateway = value;
            }
        },
        get: function () {
            return this._gateway;
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
            name: "gateway",
            valueObjectPrototypeName: "IpAddress",
            valueType: "object"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "netmask",
            valueType: "number"
        }, {
            mandatory: false,
            name: "network",
            valueObjectPrototypeName: "IpAddress",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "NetworkRouteType",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/static-route.reel'
            },
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Static Routes'"
        }
    }
});
