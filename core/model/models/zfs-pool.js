var Montage = require("montage").Montage;

exports.ZfsPool = Montage.specialize({
    _groups: {
        value: null
    },
    groups: {
        set: function (value) {
            if (this._groups !== value) {
                this._groups = value;
            }
        },
        get: function () {
            return this._groups;
        }
    },
    _guid: {
        value: null
    },
    guid: {
        set: function (value) {
            if (this._guid !== value) {
                this._guid = value;
            }
        },
        get: function () {
            return this._guid;
        }
    },
    _hostname: {
        value: null
    },
    hostname: {
        set: function (value) {
            if (this._hostname !== value) {
                this._hostname = value;
            }
        },
        get: function () {
            return this._hostname;
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
    _properties: {
        value: null
    },
    properties: {
        set: function (value) {
            if (this._properties !== value) {
                this._properties = value;
            }
        },
        get: function () {
            return this._properties;
        }
    },
    _root_dataset: {
        value: null
    },
    root_dataset: {
        set: function (value) {
            if (this._root_dataset !== value) {
                this._root_dataset = value;
            }
        },
        get: function () {
            return this._root_dataset;
        }
    },
    _scan: {
        value: null
    },
    scan: {
        set: function (value) {
            if (this._scan !== value) {
                this._scan = value;
            }
        },
        get: function () {
            return this._scan;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "groups",
            valueObjectPrototypeName: "ZfsTopology",
            valueType: "object"
        }, {
            mandatory: false,
            name: "guid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "properties",
            valueObjectPrototypeName: "ZfsProperties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "root_dataset",
            valueObjectPrototypeName: "ZfsDataset",
            valueType: "object"
        }, {
            mandatory: false,
            name: "scan",
            valueObjectPrototypeName: "ZfsScan",
            valueType: "object"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "ZfsPoolStatus",
            valueType: "object"
        }]
    }
});
