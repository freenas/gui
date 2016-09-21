var Montage = require("montage").Montage;

exports.ShareIscsiPortal = Montage.specialize({
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
    _discovery_auth_group: {
        value: null
    },
    discovery_auth_group: {
        set: function (value) {
            if (this._discovery_auth_group !== value) {
                this._discovery_auth_group = value;
            }
        },
        get: function () {
            return this._discovery_auth_group;
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
    _listen: {
        value: null
    },
    listen: {
        set: function (value) {
            if (this._listen !== value) {
                this._listen = value;
            }
        },
        get: function () {
            return this._listen;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "discovery_auth_group",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "listen",
            valueObjectPrototypeName: "ShareIscsiPortalListen",
            valueType: "object"
        }, {
            mandatory: false,
            name: "tag",
            valueType: "number"
        }]
    }
});
