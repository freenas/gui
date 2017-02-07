var Montage = require("montage").Montage;

exports.ReplicationOptions = Montage.specialize({
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
    _force: {
        value: null
    },
    force: {
        set: function (value) {
            if (this._force !== value) {
                this._force = value;
            }
        },
        get: function () {
            return this._force;
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
    _nomount: {
        value: null
    },
    nomount: {
        set: function (value) {
            if (this._nomount !== value) {
                this._nomount = value;
            }
        },
        get: function () {
            return this._nomount;
        }
    },
    _peer: {
        value: null
    },
    peer: {
        set: function (value) {
            if (this._peer !== value) {
                this._peer = value;
            }
        },
        get: function () {
            return this._peer;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "followdelete",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "force",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "lifetime",
            valueType: "number"
        }, {
            mandatory: false,
            name: "nomount",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "peer",
            valueType: "String"
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
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/replication-creator.reel'
            },
            nameExpression: "'Replicate'"
        }
    }
});
