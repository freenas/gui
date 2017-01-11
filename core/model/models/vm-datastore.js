var Montage = require("montage").Montage;

exports.VmDatastore = Montage.specialize({
    _capabilities: {
        value: null
    },
    capabilities: {
        set: function (value) {
            if (this._capabilities !== value) {
                this._capabilities = value;
            }
        },
        get: function () {
            return this._capabilities;
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
    _state: {
        value: null
    },
    state: {
        set: function (value) {
            if (this._state !== value) {
                this._state = value;
            }
        },
        get: function () {
            return this._state;
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
            name: "capabilities",
            valueObjectPrototypeName: "VmDatastoreCapabilities",
            valueType: "object"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "properties",
            valueObjectPrototypeName: "VmDatastoreProperties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "state",
            valueObjectPrototypeName: "VmDatastoreState",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }]
    }
});
