var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.ServiceConsul = AbstractModel.specialize({
    _bind_address: {
        value: null
    },
    bind_address: {
        set: function (value) {
            if (this._bind_address !== value) {
                this._bind_address = value;
            }
        },
        get: function () {
            return this._bind_address;
        }
    },
    _datacenter: {
        value: null
    },
    datacenter: {
        set: function (value) {
            if (this._datacenter !== value) {
                this._datacenter = value;
            }
        },
        get: function () {
            return this._datacenter;
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
    _encryption_key: {
        value: null
    },
    encryption_key: {
        set: function (value) {
            if (this._encryption_key !== value) {
                this._encryption_key = value;
            }
        },
        get: function () {
            return this._encryption_key;
        }
    },
    _node_name: {
        value: null
    },
    node_name: {
        set: function (value) {
            if (this._node_name !== value) {
                this._node_name = value;
            }
        },
        get: function () {
            return this._node_name;
        }
    },
    _retry_join: {
        value: null
    },
    retry_join: {
        set: function (value) {
            if (this._retry_join !== value) {
                this._retry_join = value;
            }
        },
        get: function () {
            return this._retry_join;
        }
    },
    _server: {
        value: null
    },
    server: {
        set: function (value) {
            if (this._server !== value) {
                this._server = value;
            }
        },
        get: function () {
            return this._server;
        }
    },
    _start_join: {
        value: null
    },
    start_join: {
        set: function (value) {
            if (this._start_join !== value) {
                this._start_join = value;
            }
        },
        get: function () {
            return this._start_join;
        }
    },
    _start_join_wan: {
        value: null
    },
    start_join_wan: {
        set: function (value) {
            if (this._start_join_wan !== value) {
                this._start_join_wan = value;
            }
        },
        get: function () {
            return this._start_join_wan;
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
            name: "bind_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "datacenter",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "encryption_key",
            valueType: "String"
        }, {
            mandatory: false,
            name: "node_name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "retry_join",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "server",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "start_join",
            valueType: "array"
        }, {
            mandatory: false,
            name: "start_join_wan",
            valueType: "array"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
