var Montage = require("montage").Montage;

exports.DockerContainerBridge = Montage.specialize({
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
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "dhcp",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }]
    }
});
