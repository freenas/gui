var Montage = require("montage").Montage;

exports.NetworkInterfaceVlanAnonymous = Montage.specialize({
    _parent: {
        value: null
    },
    parent: {
        set: function (value) {
            if (this._parent !== value) {
                this._parent = value;
            }
        },
        get: function () {
            return this._parent;
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
            name: "parent",
            valueType: "String"
        }, {
            mandatory: false,
            name: "tag",
            valueType: "number"
        }]
    }
});
