var Montage = require("montage").Montage;

exports.ZfsSnapshot = Montage.specialize({
    _dataset: {
        value: null
    },
    dataset: {
        set: function (value) {
            if (this._dataset !== value) {
                this._dataset = value;
            }
        },
        get: function () {
            return this._dataset;
        }
    },
    _holds: {
        value: null
    },
    holds: {
        set: function (value) {
            if (this._holds !== value) {
                this._holds = value;
            }
        },
        get: function () {
            return this._holds;
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
    _pool: {
        value: null
    },
    pool: {
        set: function (value) {
            if (this._pool !== value) {
                this._pool = value;
            }
        },
        get: function () {
            return this._pool;
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
            name: "dataset",
            valueType: "String"
        }, {
            mandatory: false,
            name: "holds",
            valueType: "object"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "pool",
            valueType: "String"
        }, {
            mandatory: false,
            name: "properties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "DatasetType",
            valueType: "object"
        }]
    }
});
