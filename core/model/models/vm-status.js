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
    },
    _vm_tools_available: {
        value: null
    },
    vm_tools_available: {
        set: function (value) {
            if (this._vm_tools_available !== value) {
                this._vm_tools_available = value;
            }
        },
        get: function () {
            return this._vm_tools_available;
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
        }, {
            mandatory: false,
            name: "vm_tools_available",
            valueType: "boolean"
        }]
    }
});
