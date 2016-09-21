var Montage = require("montage").Montage;

exports.VolumeDatasetProperties = Montage.specialize({
    _atime: {
        value: null
    },
    atime: {
        set: function (value) {
            if (this._atime !== value) {
                this._atime = value;
            }
        },
        get: function () {
            return this._atime;
        }
    },
    _available: {
        value: null
    },
    available: {
        set: function (value) {
            if (this._available !== value) {
                this._available = value;
            }
        },
        get: function () {
            return this._available;
        }
    },
    _casesensitivity: {
        value: null
    },
    casesensitivity: {
        set: function (value) {
            if (this._casesensitivity !== value) {
                this._casesensitivity = value;
            }
        },
        get: function () {
            return this._casesensitivity;
        }
    },
    _compression: {
        value: null
    },
    compression: {
        set: function (value) {
            if (this._compression !== value) {
                this._compression = value;
            }
        },
        get: function () {
            return this._compression;
        }
    },
    _compressratio: {
        value: null
    },
    compressratio: {
        set: function (value) {
            if (this._compressratio !== value) {
                this._compressratio = value;
            }
        },
        get: function () {
            return this._compressratio;
        }
    },
    _dedup: {
        value: null
    },
    dedup: {
        set: function (value) {
            if (this._dedup !== value) {
                this._dedup = value;
            }
        },
        get: function () {
            return this._dedup;
        }
    },
    _logicalreferenced: {
        value: null
    },
    logicalreferenced: {
        set: function (value) {
            if (this._logicalreferenced !== value) {
                this._logicalreferenced = value;
            }
        },
        get: function () {
            return this._logicalreferenced;
        }
    },
    _logicalused: {
        value: null
    },
    logicalused: {
        set: function (value) {
            if (this._logicalused !== value) {
                this._logicalused = value;
            }
        },
        get: function () {
            return this._logicalused;
        }
    },
    _numclones: {
        value: null
    },
    numclones: {
        set: function (value) {
            if (this._numclones !== value) {
                this._numclones = value;
            }
        },
        get: function () {
            return this._numclones;
        }
    },
    _quota: {
        value: null
    },
    quota: {
        set: function (value) {
            if (this._quota !== value) {
                this._quota = value;
            }
        },
        get: function () {
            return this._quota;
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
    _refcompressratio: {
        value: null
    },
    refcompressratio: {
        set: function (value) {
            if (this._refcompressratio !== value) {
                this._refcompressratio = value;
            }
        },
        get: function () {
            return this._refcompressratio;
        }
    },
    _referenced: {
        value: null
    },
    referenced: {
        set: function (value) {
            if (this._referenced !== value) {
                this._referenced = value;
            }
        },
        get: function () {
            return this._referenced;
        }
    },
    _refquota: {
        value: null
    },
    refquota: {
        set: function (value) {
            if (this._refquota !== value) {
                this._refquota = value;
            }
        },
        get: function () {
            return this._refquota;
        }
    },
    _refreservation: {
        value: null
    },
    refreservation: {
        set: function (value) {
            if (this._refreservation !== value) {
                this._refreservation = value;
            }
        },
        get: function () {
            return this._refreservation;
        }
    },
    _reservation: {
        value: null
    },
    reservation: {
        set: function (value) {
            if (this._reservation !== value) {
                this._reservation = value;
            }
        },
        get: function () {
            return this._reservation;
        }
    },
    _used: {
        value: null
    },
    used: {
        set: function (value) {
            if (this._used !== value) {
                this._used = value;
            }
        },
        get: function () {
            return this._used;
        }
    },
    _usedbychildren: {
        value: null
    },
    usedbychildren: {
        set: function (value) {
            if (this._usedbychildren !== value) {
                this._usedbychildren = value;
            }
        },
        get: function () {
            return this._usedbychildren;
        }
    },
    _usedbydataset: {
        value: null
    },
    usedbydataset: {
        set: function (value) {
            if (this._usedbydataset !== value) {
                this._usedbydataset = value;
            }
        },
        get: function () {
            return this._usedbydataset;
        }
    },
    _usedbyrefreservation: {
        value: null
    },
    usedbyrefreservation: {
        set: function (value) {
            if (this._usedbyrefreservation !== value) {
                this._usedbyrefreservation = value;
            }
        },
        get: function () {
            return this._usedbyrefreservation;
        }
    },
    _usedbysnapshots: {
        value: null
    },
    usedbysnapshots: {
        set: function (value) {
            if (this._usedbysnapshots !== value) {
                this._usedbysnapshots = value;
            }
        },
        get: function () {
            return this._usedbysnapshots;
        }
    },
    _volblocksize: {
        value: null
    },
    volblocksize: {
        set: function (value) {
            if (this._volblocksize !== value) {
                this._volblocksize = value;
            }
        },
        get: function () {
            return this._volblocksize;
        }
    },
    _volsize: {
        value: null
    },
    volsize: {
        set: function (value) {
            if (this._volsize !== value) {
                this._volsize = value;
            }
        },
        get: function () {
            return this._volsize;
        }
    },
    _written: {
        value: null
    },
    written: {
        set: function (value) {
            if (this._written !== value) {
                this._written = value;
            }
        },
        get: function () {
            return this._written;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "atime",
            valueObjectPrototypeName: "VolumeDatasetPropertyAtime",
            valueType: "object"
        }, {
            mandatory: false,
            name: "available",
            valueObjectPrototypeName: "VolumeDatasetPropertyAvailable",
            valueType: "object"
        }, {
            mandatory: false,
            name: "casesensitivity",
            valueObjectPrototypeName: "VolumeDatasetPropertyCasesensitivity",
            valueType: "object"
        }, {
            mandatory: false,
            name: "compression",
            valueObjectPrototypeName: "VolumeDatasetPropertyCompression",
            valueType: "object"
        }, {
            mandatory: false,
            name: "compressratio",
            valueObjectPrototypeName: "VolumeDatasetPropertyCompressratio",
            valueType: "object"
        }, {
            mandatory: false,
            name: "dedup",
            valueObjectPrototypeName: "VolumeDatasetPropertyDedup",
            valueType: "object"
        }, {
            mandatory: false,
            name: "logicalreferenced",
            valueObjectPrototypeName: "VolumeDatasetPropertyLogicalreferenced",
            valueType: "object"
        }, {
            mandatory: false,
            name: "logicalused",
            valueObjectPrototypeName: "VolumeDatasetPropertyLogicalused",
            valueType: "object"
        }, {
            mandatory: false,
            name: "numclones",
            valueObjectPrototypeName: "VolumeDatasetPropertyNumclones",
            valueType: "object"
        }, {
            mandatory: false,
            name: "quota",
            valueObjectPrototypeName: "VolumeDatasetPropertyQuota",
            valueType: "object"
        }, {
            mandatory: false,
            name: "readonly",
            valueObjectPrototypeName: "VolumeDatasetPropertyReadonly",
            valueType: "object"
        }, {
            mandatory: false,
            name: "refcompressratio",
            valueObjectPrototypeName: "VolumeDatasetPropertyRefcompressratio",
            valueType: "object"
        }, {
            mandatory: false,
            name: "referenced",
            valueObjectPrototypeName: "VolumeDatasetPropertyReferenced",
            valueType: "object"
        }, {
            mandatory: false,
            name: "refquota",
            valueObjectPrototypeName: "VolumeDatasetPropertyRefquota",
            valueType: "object"
        }, {
            mandatory: false,
            name: "refreservation",
            valueObjectPrototypeName: "VolumeDatasetPropertyRefreservation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "reservation",
            valueObjectPrototypeName: "VolumeDatasetPropertyReservation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "used",
            valueObjectPrototypeName: "VolumeDatasetPropertyUsed",
            valueType: "object"
        }, {
            mandatory: false,
            name: "usedbychildren",
            valueObjectPrototypeName: "VolumeDatasetPropertyUsedbychildren",
            valueType: "object"
        }, {
            mandatory: false,
            name: "usedbydataset",
            valueObjectPrototypeName: "VolumeDatasetPropertyUsedbydataset",
            valueType: "object"
        }, {
            mandatory: false,
            name: "usedbyrefreservation",
            valueObjectPrototypeName: "VolumeDatasetPropertyUsedbyrefreservation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "usedbysnapshots",
            valueObjectPrototypeName: "VolumeDatasetPropertyUsedbysnapshots",
            valueType: "object"
        }, {
            mandatory: false,
            name: "volblocksize",
            valueObjectPrototypeName: "VolumeDatasetPropertyVolblocksize",
            valueType: "object"
        }, {
            mandatory: false,
            name: "volsize",
            valueObjectPrototypeName: "VolumeDatasetPropertyVolsize",
            valueType: "object"
        }, {
            mandatory: false,
            name: "written",
            valueObjectPrototypeName: "VolumeDatasetPropertyWritten",
            valueType: "object"
        }]
    }
});
