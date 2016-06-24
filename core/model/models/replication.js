var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.Replication = AbstractModel.specialize({
    _followdelete: {
        value: null
    },
    followdelete: {
        set: function (value) {
            if (this._followdelete !== value) {
                this._followdelete = value;
            }
        },
        get: function () {
            return this._followdelete;
        }
    },
    _lifetime: {
        value: null
    },
    lifetime: {
        set: function (value) {
            if (this._lifetime !== value) {
                this._lifetime = value;
            }
        },
        get: function () {
            return this._lifetime;
        }
    },
    _recursive: {
        value: null
    },
    recursive: {
        set: function (value) {
            if (this._recursive !== value) {
                this._recursive = value;
            }
        },
        get: function () {
            return this._recursive;
        }
    },
    _remote: {
        value: null
    },
    remote: {
        set: function (value) {
            if (this._remote !== value) {
                this._remote = value;
            }
        },
        get: function () {
            return this._remote;
        }
    },
    _remote_dataset: {
        value: null
    },
    remote_dataset: {
        set: function (value) {
            if (this._remote_dataset !== value) {
                this._remote_dataset = value;
            }
        },
        get: function () {
            return this._remote_dataset;
        }
    },
    _transport_plugins: {
        value: null
    },
    transport_plugins: {
        set: function (value) {
            if (this._transport_plugins !== value) {
                this._transport_plugins = value;
            }
        },
        get: function () {
            return this._transport_plugins;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "followdelete",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "lifetime",
            valueType: "number"
        }, {
            mandatory: false,
            name: "recursive",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "remote",
            valueType: "String"
        }, {
            mandatory: false,
            name: "remote_dataset",
            valueType: "String"
        }, {
            mandatory: false,
            name: "transport_plugins",
            valueObjectPrototypeName: "ReplicationTransportPlugin",
            valueType: "object"
        }]
    }
});
