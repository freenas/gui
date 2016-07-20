var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmStatus = AbstractModel.specialize({
    _nat_lease: {
        value: null
    },
    nat_lease: {
        set: function (value) {
            if (this._nat_lease !== value) {
                this._nat_lease = value;
            }
        },
        get: function () {
            return this._nat_lease;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "nat_lease",
            valueObjectPrototypeName: "VmStatusNatlease",
            valueType: "object"
        }, {
            mandatory: false,
            name: "state",
            valueObjectPrototypeName: "VmStatusState",
            valueType: "object"
        }]
    }
});
