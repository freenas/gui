var Montage = require("montage").Montage;

exports.Disk = Montage.specialize({
    _acoustic_level: {
        value: null
    },
    acoustic_level: {
        set: function (value) {
            if (this._acoustic_level !== value) {
                this._acoustic_level = value;
            }
        },
        get: function () {
            return this._acoustic_level;
        }
    },
    _apm_mode: {
        value: null
    },
    apm_mode: {
        set: function (value) {
            if (this._apm_mode !== value) {
                this._apm_mode = value;
            }
        },
        get: function () {
            return this._apm_mode;
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
    _is_multipath: {
        value: null
    },
    is_multipath: {
        set: function (value) {
            if (this._is_multipath !== value) {
                this._is_multipath = value;
            }
        },
        get: function () {
            return this._is_multipath;
        }
    },
    _mediasize: {
        value: null
    },
    mediasize: {
        set: function (value) {
            if (this._mediasize !== value) {
                this._mediasize = value;
            }
        },
        get: function () {
            return this._mediasize;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    },
    _path: {
        value: null
    },
    path: {
        set: function (value) {
            if (this._path !== value) {
                this._path = value;
            }
        },
        get: function () {
            return this._path;
        }
    },
    _rname: {
        value: null
    },
    rname: {
        set: function (value) {
            if (this._rname !== value) {
                this._rname = value;
            }
        },
        get: function () {
            return this._rname;
        }
    },
    _serial: {
        value: null
    },
    serial: {
        set: function (value) {
            if (this._serial !== value) {
                this._serial = value;
            }
        },
        get: function () {
            return this._serial;
        }
    },
    _smart: {
        value: null
    },
    smart: {
        set: function (value) {
            if (this._smart !== value) {
                this._smart = value;
            }
        },
        get: function () {
            return this._smart;
        }
    },
    _smart_options: {
        value: null
    },
    smart_options: {
        set: function (value) {
            if (this._smart_options !== value) {
                this._smart_options = value;
            }
        },
        get: function () {
            return this._smart_options;
        }
    },
    _standby_mode: {
        value: null
    },
    standby_mode: {
        set: function (value) {
            if (this._standby_mode !== value) {
                this._standby_mode = value;
            }
        },
        get: function () {
            return this._standby_mode;
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
            name: "acoustic_level",
            valueObjectPrototypeName: "DiskAcousticlevel",
            valueType: "object"
        }, {
            mandatory: false,
            name: "apm_mode",
            valueType: "number"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "is_multipath",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "mediasize",
            valueType: "number"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "rname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "serial",
            valueType: "String"
        }, {
            mandatory: false,
            name: "smart",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "smart_options",
            valueType: "String"
        }, {
            mandatory: false,
            name: "standby_mode",
            valueType: "number"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "DiskStatus",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/disk.reel'
            },
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Available disks'",
            nameExpression: "path"
        }
    }
});
