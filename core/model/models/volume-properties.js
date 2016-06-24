var Montage = require("montage/core/core").Montage;
var VolumePropertyAllocated = require("core/model/models/volume-property-allocated").VolumePropertyAllocated;
var VolumePropertyAutoreplace = require("core/model/models/volume-property-autoreplace").VolumePropertyAutoreplace;
var VolumePropertyCapacity = require("core/model/models/volume-property-capacity").VolumePropertyCapacity;
var VolumePropertyComment = require("core/model/models/volume-property-comment").VolumePropertyComment;
var VolumePropertyDedupratio = require("core/model/models/volume-property-dedupratio").VolumePropertyDedupratio;
var VolumePropertyDelegation = require("core/model/models/volume-property-delegation").VolumePropertyDelegation;
var VolumePropertyExpandsize = require("core/model/models/volume-property-expandsize").VolumePropertyExpandsize;
var VolumePropertyFailmode = require("core/model/models/volume-property-failmode").VolumePropertyFailmode;
var VolumePropertyFragmentation = require("core/model/models/volume-property-fragmentation").VolumePropertyFragmentation;
var VolumePropertyFree = require("core/model/models/volume-property-free").VolumePropertyFree;
var VolumePropertyHealth = require("core/model/models/volume-property-health").VolumePropertyHealth;
var VolumePropertyLeaked = require("core/model/models/volume-property-leaked").VolumePropertyLeaked;
var VolumePropertyReadonly = require("core/model/models/volume-property-readonly").VolumePropertyReadonly;
var VolumePropertySize = require("core/model/models/volume-property-size").VolumePropertySize;
var VolumePropertyVersion = require("core/model/models/volume-property-version").VolumePropertyVersion;

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
            return this._allocated || (this._allocated = new VolumePropertyAllocated());
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
            return this._autoreplace || (this._autoreplace = new VolumePropertyAutoreplace());
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
            return this._capacity || (this._capacity = new VolumePropertyCapacity());
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
            return this._comment || (this._comment = new VolumePropertyComment());
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
            return this._dedupratio || (this._dedupratio = new VolumePropertyDedupratio());
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
            return this._delegation || (this._delegation = new VolumePropertyDelegation());
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
            return this._expandsize || (this._expandsize = new VolumePropertyExpandsize());
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
            return this._failmode || (this._failmode = new VolumePropertyFailmode());
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
            return this._fragmentation || (this._fragmentation = new VolumePropertyFragmentation());
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
            return this._free || (this._free = new VolumePropertyFree());
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
            return this._health || (this._health = new VolumePropertyHealth());
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
            return this._leaked || (this._leaked = new VolumePropertyLeaked());
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
            return this._readonly || (this._readonly = new VolumePropertyReadonly());
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
            return this._size || (this._size = new VolumePropertySize());
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
            return this._version || (this._version = new VolumePropertyVersion());
        }
    }
});
