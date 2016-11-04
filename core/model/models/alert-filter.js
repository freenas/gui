var Montage = require("montage").Montage;

exports.AlertFilter = Montage.specialize({
    _emitter: {
        value: null
    },
    emitter: {
        set: function (value) {
            if (this._emitter !== value) {
                this._emitter = value;
            }
        },
        get: function () {
            return this._emitter;
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
    _parameters: {
        value: null
    },
    parameters: {
        set: function (value) {
            if (this._parameters !== value) {
                this._parameters = value;
            }
        },
        get: function () {
            return this._parameters;
        }
    },
    _predicates: {
        value: null
    },
    predicates: {
        set: function (value) {
            if (this._predicates !== value) {
                this._predicates = value;
            }
        },
        get: function () {
            return this._predicates;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "emitter",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "parameters",
            valueObjectPrototypeName: "AlertEmitterEmail",
            valueType: "object"
        }, {
            mandatory: false,
            name: "predicates",
            valueType: "array"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Alert Filters'",
            inspectorComponentModule: {
                id: 'ui/sections/system/inspectors/alert.reel/alert-filter.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/system/inspectors/alert.reel/alert-filter.reel'
            },
            nameExpression: "!_isNew && id.defined() ? id : 'Create an Alert filter'"
        }
    }
});
