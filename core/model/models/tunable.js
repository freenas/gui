var Montage = require("montage").Montage;

exports.Tunable = Montage.specialize({
    _comment: {
        value: null
    },
    comment: {
        set: function (value) {
            if (this._comment !== value) {
                this._comment = value;
            }
        },
        get: function () {
            return this._comment;
        }
    },
    _enabled: {
        value: null
    },
    enabled: {
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
            }
        },
        get: function () {
            return this._enabled;
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
    },
    _value: {
        value: null
    },
    value: {
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
            }
        },
        get: function () {
            return this._value;
        }
    },
    _var: {
        value: null
    },
    var: {
        set: function (value) {
            if (this._var !== value) {
                this._var = value;
            }
        },
        get: function () {
            return this._var;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "comment",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "TunableType",
            valueType: "object"
        }, {
            mandatory: false,
            name: "value",
            valueType: "String"
        }, {
            mandatory: false,
            name: "var",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/system/inspectors/tunable.reel'
            },
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Tunables'",
            creatorComponentModule: {
                id: 'ui/sections/system/inspectors/tunable.reel'
            },
            nameExpression: "_isNew.defined() && _isNew ? 'Add a Tunable' : var"
        }
    }
});
