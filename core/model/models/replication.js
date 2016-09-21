var Montage = require("montage").Montage;

exports.Replication = Montage.specialize({
    _auto_recover: {
        value: null
    },
    auto_recover: {
        set: function (value) {
            if (this._auto_recover !== value) {
                this._auto_recover = value;
            }
        },
        get: function () {
            return this._auto_recover;
        }
    },
    _bidirectional: {
        value: null
    },
    bidirectional: {
        set: function (value) {
            if (this._bidirectional !== value) {
                this._bidirectional = value;
            }
        },
        get: function () {
            return this._bidirectional;
        }
    },
    _datasets: {
        value: null
    },
    datasets: {
        set: function (value) {
            if (this._datasets !== value) {
                this._datasets = value;
            }
        },
        get: function () {
            return this._datasets;
        }
    },
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
    _initial_master: {
        value: null
    },
    initial_master: {
        set: function (value) {
            if (this._initial_master !== value) {
                this._initial_master = value;
            }
        },
        get: function () {
            return this._initial_master;
        }
    },
    _master: {
        value: null
    },
    master: {
        set: function (value) {
            if (this._master !== value) {
                this._master = value;
            }
        },
        get: function () {
            return this._master;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
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
    _replicate_services: {
        value: null
    },
    replicate_services: {
        set: function (value) {
            if (this._replicate_services !== value) {
                this._replicate_services = value;
            }
        },
        get: function () {
            return this._replicate_services;
        }
    },
    _slave: {
        value: null
    },
    slave: {
        set: function (value) {
            if (this._slave !== value) {
                this._slave = value;
            }
        },
        get: function () {
            return this._slave;
        }
    },
    _snapshot_lifetime: {
        value: null
    },
    snapshot_lifetime: {
        set: function (value) {
            if (this._snapshot_lifetime !== value) {
                this._snapshot_lifetime = value;
            }
        },
        get: function () {
            return this._snapshot_lifetime;
        }
    },
    _status: {
        value: null
    },
    status: {
        set: function (value) {
            if (this._status !== value) {
                this._status = value;
            }
        },
        get: function () {
            return this._status;
        }
    },
    _transport_options: {
        value: null
    },
    transport_options: {
        set: function (value) {
            if (this._transport_options !== value) {
                this._transport_options = value;
            }
        },
        get: function () {
            return this._transport_options;
        }
    },
    _update_date: {
        value: null
    },
    update_date: {
        set: function (value) {
            if (this._update_date !== value) {
                this._update_date = value;
            }
        },
        get: function () {
            return this._update_date;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "auto_recover",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "bidirectional",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "datasets",
            valueType: "array"
        }, {
            mandatory: false,
            name: "followdelete",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "initial_master",
            valueType: "String"
        }, {
            mandatory: false,
            name: "master",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "recursive",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "replicate_services",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "slave",
            valueType: "String"
        }, {
            mandatory: false,
            name: "snapshot_lifetime",
            valueType: "number"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "ReplicationStatus",
            valueType: "object"
        }, {
            mandatory: false,
            name: "transport_options",
            valueObjectPrototypeName: "ReplicationTransportOption",
            valueType: "array"
        }, {
            mandatory: false,
            name: "update_date",
            valueType: "String"
        }]
    }
});
