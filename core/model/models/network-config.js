var Montage = require("montage").Montage;

exports.NetworkConfig = Montage.specialize({
    _autoconfigure: {
        value: null
    },
    autoconfigure: {
        set: function (value) {
            if (this._autoconfigure !== value) {
                this._autoconfigure = value;
            }
        },
        get: function () {
            return this._autoconfigure;
        }
    },
    _dhcp: {
        value: null
    },
    dhcp: {
        set: function (value) {
            if (this._dhcp !== value) {
                this._dhcp = value;
            }
        },
        get: function () {
            return this._dhcp;
        }
    },
    _dns: {
        value: null
    },
    dns: {
        set: function (value) {
            if (this._dns !== value) {
                this._dns = value;
            }
        },
        get: function () {
            return this._dns;
        }
    },
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
    _http_proxy: {
        value: null
    },
    http_proxy: {
        set: function (value) {
            if (this._http_proxy !== value) {
                this._http_proxy = value;
            }
        },
        get: function () {
            return this._http_proxy;
        }
    },
    _netwait: {
        value: null
    },
    netwait: {
        set: function (value) {
            if (this._netwait !== value) {
                this._netwait = value;
            }
        },
        get: function () {
            return this._netwait;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "autoconfigure",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "dhcp",
            valueType: "object"
        }, {
            mandatory: false,
            name: "dns",
            valueType: "object"
        }, {
            mandatory: false,
            name: "gateway",
            valueType: "object"
        }, {
            mandatory: false,
            name: "http_proxy",
            valueType: "String"
        }, {
            mandatory: false,
            name: "netwait",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/network-configuration.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/network-configuration.reel'
            },
            nameExpression: "'Settings'"
        }
    }
});
