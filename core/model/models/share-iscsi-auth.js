var Montage = require("montage").Montage;

exports.ShareIscsiAuth = Montage.specialize({
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
    _initiators: {
        value: null
    },
    initiators: {
        set: function (value) {
            if (this._initiators !== value) {
                this._initiators = value;
            }
        },
        get: function () {
            return this._initiators;
        }
    },
    _networks: {
        value: null
    },
    networks: {
        set: function (value) {
            if (this._networks !== value) {
                this._networks = value;
            }
        },
        get: function () {
            return this._networks;
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
    _users: {
        value: null
    },
    users: {
        set: function (value) {
            if (this._users !== value) {
                this._users = value;
            }
        },
        get: function () {
            return this._users;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "initiators",
            valueType: "array"
        }, {
            mandatory: false,
            name: "networks",
            valueType: "array"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "ShareIscsiAuthType",
            valueType: "object"
        }, {
            mandatory: false,
            name: "users",
            valueType: "array"
        }]
    }
});
