var Montage = require("montage").Montage;

exports.ServiceIscsi = Montage.specialize({
    _base_name: {
        value: null
    },
    base_name: {
        set: function (value) {
            if (this._base_name !== value) {
                this._base_name = value;
            }
        },
        get: function () {
            return this._base_name;
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
    },
    _isns_servers: {
        value: null
    },
    isns_servers: {
        set: function (value) {
            if (this._isns_servers !== value) {
                this._isns_servers = value;
            }
        },
        get: function () {
            return this._isns_servers;
        }
    },
    _pool_space_threshold: {
        value: null
    },
    pool_space_threshold: {
        set: function (value) {
            if (this._pool_space_threshold !== value) {
                this._pool_space_threshold = value;
            }
        },
        get: function () {
            return this._pool_space_threshold;
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
            name: "base_name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "isns_servers",
            valueType: "array"
        }, {
            mandatory: false,
            name: "pool_space_threshold",
            valueType: "number"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
