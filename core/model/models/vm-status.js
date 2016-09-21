var Montage = require("montage").Montage;

exports.VmStatus = Montage.specialize({
    _management_lease: {
        value: null
    },
    management_lease: {
        set: function (value) {
            if (this._management_lease !== value) {
                this._management_lease = value;
            }
        },
        get: function () {
            return this._management_lease;
        }
    },
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
            name: "management_lease",
            valueObjectPrototypeName: "VmStatusLease",
            valueType: "object"
        }, {
            mandatory: false,
            name: "nat_lease",
            valueObjectPrototypeName: "VmStatusLease",
            valueType: "object"
        }, {
            mandatory: false,
            name: "state",
            valueObjectPrototypeName: "VmStatusState",
            valueType: "object"
        }]
    }
});
