var Montage = require("montage").Montage;

exports.ZfsDataset = Montage.specialize({
    _children: {
        value: null
    },
    children: {
        set: function (value) {
            if (this._children !== value) {
                this._children = value;
            }
        },
        get: function () {
            return this._children;
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
            name: "children",
            valueObjectPrototypeName: "ZfsDataset",
            valueType: "array"
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
