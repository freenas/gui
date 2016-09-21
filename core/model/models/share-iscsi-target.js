var Montage = require("montage").Montage;

exports.ShareIscsiTarget = Montage.specialize({
    _auth_group: {
        value: null
    },
    auth_group: {
        set: function (value) {
            if (this._auth_group !== value) {
                this._auth_group = value;
            }
        },
        get: function () {
            return this._auth_group;
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
    _extents: {
        value: null
    },
    extents: {
        set: function (value) {
            if (this._extents !== value) {
                this._extents = value;
            }
        },
        get: function () {
            return this._extents;
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
    _portal_group: {
        value: null
    },
    portal_group: {
        set: function (value) {
            if (this._portal_group !== value) {
                this._portal_group = value;
            }
        },
        get: function () {
            return this._portal_group;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "auth_group",
            valueType: "String"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "extents",
            valueType: "array"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "portal_group",
            valueType: "String"
        }]
    }
});
