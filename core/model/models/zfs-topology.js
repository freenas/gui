var Montage = require("montage").Montage;

exports.ZfsTopology = Montage.specialize({
    _cache: {
        value: null
    },
    cache: {
        set: function (value) {
            if (this._cache !== value) {
                this._cache = value;
            }
        },
        get: function () {
            return this._cache;
        }
    },
    _data: {
        value: null
    },
    data: {
        set: function (value) {
            if (this._data !== value) {
                this._data = value;
            }
        },
        get: function () {
            return this._data;
        }
    },
    _log: {
        value: null
    },
    log: {
        set: function (value) {
            if (this._log !== value) {
                this._log = value;
            }
        },
        get: function () {
            return this._log;
        }
    },
    _spare: {
        value: null
    },
    spare: {
        set: function (value) {
            if (this._spare !== value) {
                this._spare = value;
            }
        },
        get: function () {
            return this._spare;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "cache",
            valueObjectPrototypeName: "ZfsVdev",
            valueType: "array"
        }, {
            mandatory: false,
            name: "data",
            valueObjectPrototypeName: "ZfsVdev",
            valueType: "array"
        }, {
            mandatory: false,
            name: "log",
            valueObjectPrototypeName: "ZfsVdev",
            valueType: "array"
        }, {
            mandatory: false,
            name: "spare",
            valueObjectPrototypeName: "ZfsVdev",
            valueType: "array"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/topology.reel'
            },
            nameExpression: "'Topology'"
        }
    }
});
