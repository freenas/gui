var Montage = require("montage").Montage;

exports.DiskStatusMultipathAnonymous = Montage.specialize({
    _members: {
        value: null
    },
    members: {
        set: function (value) {
            if (this._members !== value) {
                this._members = value;
            }
        },
        get: function () {
            return this._members;
        }
    },
    _node: {
        value: null
    },
    node: {
        set: function (value) {
            if (this._node !== value) {
                this._node = value;
            }
        },
        get: function () {
            return this._node;
        }
    },
    _status: {
        value: null
    },
    status: {
        set: function (value) {
            if (this._status !== value) {
                this._status = value;
            }
        },
        get: function () {
            return this._status;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "members",
            valueType: "array"
        }, {
            mandatory: false,
            name: "node",
            valueType: "String"
        }, {
            mandatory: false,
            name: "status",
            valueType: "String"
        }]
    }
});
