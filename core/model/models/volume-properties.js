var Montage = require("montage").Montage;

exports.VolumeProperties = Montage.specialize({
    _allocated: {
        value: null
    },
    allocated: {
        set: function (value) {
            if (this._allocated !== value) {
                this._allocated = value;
            }
        },
        get: function () {
            return this._allocated;
        }
    },
    _autoreplace: {
        value: null
    },
    autoreplace: {
        set: function (value) {
            if (this._autoreplace !== value) {
                this._autoreplace = value;
            }
        },
        get: function () {
            return this._autoreplace;
        }
    },
    _capacity: {
        value: null
    },
    capacity: {
        set: function (value) {
            if (this._capacity !== value) {
                this._capacity = value;
            }
        },
        get: function () {
            return this._capacity;
        }
    },
    _comment: {
        value: null
    },
    comment: {
        set: function (value) {
            if (this._comment !== value) {
                this._comment = value;
            }
        },
        get: function () {
            return this._comment;
        }
    },
    _dedupratio: {
        value: null
    },
    dedupratio: {
        set: function (value) {
            if (this._dedupratio !== value) {
                this._dedupratio = value;
            }
        },
        get: function () {
            return this._dedupratio;
        }
    },
    _delegation: {
        value: null
    },
    delegation: {
        set: function (value) {
            if (this._delegation !== value) {
                this._delegation = value;
            }
        },
        get: function () {
            return this._delegation;
        }
    },
    _expandsize: {
        value: null
    },
    expandsize: {
        set: function (value) {
            if (this._expandsize !== value) {
                this._expandsize = value;
            }
        },
        get: function () {
            return this._expandsize;
        }
    },
    _failmode: {
        value: null
    },
    failmode: {
        set: function (value) {
            if (this._failmode !== value) {
                this._failmode = value;
            }
        },
        get: function () {
            return this._failmode;
        }
    },
    _fragmentation: {
        value: null
    },
    fragmentation: {
        set: function (value) {
            if (this._fragmentation !== value) {
                this._fragmentation = value;
            }
        },
        get: function () {
            return this._fragmentation;
        }
    },
    _free: {
        value: null
    },
    free: {
        set: function (value) {
            if (this._free !== value) {
                this._free = value;
            }
        },
        get: function () {
            return this._free;
        }
    },
    _health: {
        value: null
    },
    health: {
        set: function (value) {
            if (this._health !== value) {
                this._health = value;
            }
        },
        get: function () {
            return this._health;
        }
    },
    _leaked: {
        value: null
    },
    leaked: {
        set: function (value) {
            if (this._leaked !== value) {
                this._leaked = value;
            }
        },
        get: function () {
            return this._leaked;
        }
    },
    _readonly: {
        value: null
    },
    readonly: {
        set: function (value) {
            if (this._readonly !== value) {
                this._readonly = value;
            }
        },
        get: function () {
            return this._readonly;
        }
    },
    _size: {
        value: null
    },
    size: {
        set: function (value) {
            if (this._size !== value) {
                this._size = value;
            }
        },
        get: function () {
            return this._size;
        }
    },
    _version: {
        value: null
    },
    version: {
        set: function (value) {
            if (this._version !== value) {
                this._version = value;
            }
        },
        get: function () {
            return this._version;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "allocated",
            valueObjectPrototypeName: "VolumePropertyAllocated",
            valueType: "object"
        }, {
            mandatory: false,
            name: "autoreplace",
            valueObjectPrototypeName: "VolumePropertyAutoreplace",
            valueType: "object"
        }, {
            mandatory: false,
            name: "capacity",
            valueObjectPrototypeName: "VolumePropertyCapacity",
            valueType: "object"
        }, {
            mandatory: false,
            name: "comment",
            valueObjectPrototypeName: "VolumePropertyComment",
            valueType: "object"
        }, {
            mandatory: false,
            name: "dedupratio",
            valueObjectPrototypeName: "VolumePropertyDedupratio",
            valueType: "object"
        }, {
            mandatory: false,
            name: "delegation",
            valueObjectPrototypeName: "VolumePropertyDelegation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "expandsize",
            valueObjectPrototypeName: "VolumePropertyExpandsize",
            valueType: "object"
        }, {
            mandatory: false,
            name: "failmode",
            valueObjectPrototypeName: "VolumePropertyFailmode",
            valueType: "object"
        }, {
            mandatory: false,
            name: "fragmentation",
            valueObjectPrototypeName: "VolumePropertyFragmentation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "free",
            valueObjectPrototypeName: "VolumePropertyFree",
            valueType: "object"
        }, {
            mandatory: false,
            name: "health",
            valueObjectPrototypeName: "VolumePropertyHealth",
            valueType: "object"
        }, {
            mandatory: false,
            name: "leaked",
            valueObjectPrototypeName: "VolumePropertyLeaked",
            valueType: "object"
        }, {
            mandatory: false,
            name: "readonly",
            valueObjectPrototypeName: "VolumePropertyReadonly",
            valueType: "object"
        }, {
            mandatory: false,
            name: "size",
            valueObjectPrototypeName: "VolumePropertySize",
            valueType: "object"
        }, {
            mandatory: false,
            name: "version",
            valueObjectPrototypeName: "VolumePropertyVersion",
            valueType: "object"
        }]
    }
});
