var Montage = require("montage").Montage;

exports.Neighbor = Montage.specialize({
    _address: {
        value: null
    },
    address: {
        set: function (value) {
            if (this._address !== value) {
                this._address = value;
            }
        },
        get: function () {
            return this._address;
        }
    },
    _description: {
        value: null
    },
    description: {
        set: function (value) {
            if (this._description !== value) {
                this._description = value;
            }
        },
        get: function () {
            return this._description;
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
    _online: {
        value: null
    },
    online: {
        set: function (value) {
            if (this._online !== value) {
                this._online = value;
            }
        },
        get: function () {
            return this._online;
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
    _source: {
        value: null
    },
    source: {
        set: function (value) {
            if (this._source !== value) {
                this._source = value;
            }
        },
        get: function () {
            return this._source;
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
            name: "address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "online",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "properties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "source",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "NeighbodType",
            valueType: "object"
        }]
    }
});
