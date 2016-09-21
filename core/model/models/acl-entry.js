var Montage = require("montage").Montage;

exports.AclEntry = Montage.specialize({
    _flags: {
        value: null
    },
    flags: {
        set: function (value) {
            if (this._flags !== value) {
                this._flags = value;
            }
        },
        get: function () {
            return this._flags;
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
    _perms: {
        value: null
    },
    perms: {
        set: function (value) {
            if (this._perms !== value) {
                this._perms = value;
            }
        },
        get: function () {
            return this._perms;
        }
    },
    _tag: {
        value: null
    },
    tag: {
        set: function (value) {
            if (this._tag !== value) {
                this._tag = value;
            }
        },
        get: function () {
            return this._tag;
        }
    },
    _text: {
        value: null
    },
    text: {
        set: function (value) {
            if (this._text !== value) {
                this._text = value;
            }
        },
        get: function () {
            return this._text;
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
            name: "flags",
            valueObjectPrototypeName: "AclEntryFlags",
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
            name: "perms",
            valueObjectPrototypeName: "AclEntryPerms",
            valueType: "object"
        }, {
            mandatory: false,
            name: "tag",
            valueObjectPrototypeName: "AclEntryTag",
            valueType: "object"
        }, {
            mandatory: false,
            name: "text",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "AclEntryType",
            valueType: "object"
        }]
    }
});
