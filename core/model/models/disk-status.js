var Montage = require("montage").Montage;

exports.DiskStatus = Montage.specialize({
    _controller: {
        value: null
    },
    controller: {
        set: function (value) {
            if (this._controller !== value) {
                this._controller = value;
            }
        },
        get: function () {
            return this._controller;
        }
    },
    _data_partition_path: {
        value: null
    },
    data_partition_path: {
        set: function (value) {
            if (this._data_partition_path !== value) {
                this._data_partition_path = value;
            }
        },
        get: function () {
            return this._data_partition_path;
        }
    },
    _data_partition_uuid: {
        value: null
    },
    data_partition_uuid: {
        set: function (value) {
            if (this._data_partition_uuid !== value) {
                this._data_partition_uuid = value;
            }
        },
        get: function () {
            return this._data_partition_uuid;
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
    _empty: {
        value: null
    },
    empty: {
        set: function (value) {
            if (this._empty !== value) {
                this._empty = value;
            }
        },
        get: function () {
            return this._empty;
        }
    },
    _enclosure: {
        value: null
    },
    enclosure: {
        set: function (value) {
            if (this._enclosure !== value) {
                this._enclosure = value;
            }
        },
        get: function () {
            return this._enclosure;
        }
    },
    _encrypted: {
        value: null
    },
    encrypted: {
        set: function (value) {
            if (this._encrypted !== value) {
                this._encrypted = value;
            }
        },
        get: function () {
            return this._encrypted;
        }
    },
    _gdisk_name: {
        value: null
    },
    gdisk_name: {
        set: function (value) {
            if (this._gdisk_name !== value) {
                this._gdisk_name = value;
            }
        },
        get: function () {
            return this._gdisk_name;
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
    _interface: {
        value: null
    },
    interface: {
        set: function (value) {
            if (this._interface !== value) {
                this._interface = value;
            }
        }, get: function () {
            return this._interface;
        }
    },
    _is_encrypted: {
        value: null
    },
    is_encrypted: {
        set: function (value) {
            if (this._is_encrypted !== value) {
                this._is_encrypted = value;
            }
        },
        get: function () {
            return this._is_encrypted;
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
    _is_ssd: {
        value: null
    },
    is_ssd: {
        set: function (value) {
            if (this._is_ssd !== value) {
                this._is_ssd = value;
            }
        },
        get: function () {
            return this._is_ssd;
        }
    },
    _lunid: {
        value: null
    },
    lunid: {
        set: function (value) {
            if (this._lunid !== value) {
                this._lunid = value;
            }
        },
        get: function () {
            return this._lunid;
        }
    },
    _max_rotation: {
        value: null
    },
    max_rotation: {
        set: function (value) {
            if (this._max_rotation !== value) {
                this._max_rotation = value;
            }
        },
        get: function () {
            return this._max_rotation;
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
    _model: {
        value: null
    },
    model: {
        set: function (value) {
            if (this._model !== value) {
                this._model = value;
            }
        },
        get: function () {
            return this._model;
        }
    },
    _multipath: {
        value: null
    },
    multipath: {
        set: function (value) {
            if (this._multipath !== value) {
                this._multipath = value;
            }
        },
        get: function () {
            return this._multipath;
        }
    },
    _partitions: {
        value: null
    },
    partitions: {
        set: function (value) {
            if (this._partitions !== value) {
                this._partitions = value;
            }
        },
        get: function () {
            return this._partitions;
        }
    },
    _schema: {
        value: null
    },
    schema: {
        set: function (value) {
            if (this._schema !== value) {
                this._schema = value;
            }
        },
        get: function () {
            return this._schema;
        }
    },
    _sectorsize: {
        value: null
    },
    sectorsize: {
        set: function (value) {
            if (this._sectorsize !== value) {
                this._sectorsize = value;
            }
        },
        get: function () {
            return this._sectorsize;
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
    _smart_capable: {
        value: null
    },
    smart_capable: {
        set: function (value) {
            if (this._smart_capable !== value) {
                this._smart_capable = value;
            }
        },
        get: function () {
            return this._smart_capable;
        }
    },
    _smart_enabled: {
        value: null
    },
    smart_enabled: {
        set: function (value) {
            if (this._smart_enabled !== value) {
                this._smart_enabled = value;
            }
        },
        get: function () {
            return this._smart_enabled;
        }
    },
    _smart_status: {
        value: null
    },
    smart_status: {
        set: function (value) {
            if (this._smart_status !== value) {
                this._smart_status = value;
            }
        },
        get: function () {
            return this._smart_status;
        }
    },
    _swap_partition_path: {
        value: null
    },
    swap_partition_path: {
        set: function (value) {
            if (this._swap_partition_path !== value) {
                this._swap_partition_path = value;
            }
        },
        get: function () {
            return this._swap_partition_path;
        }
    },
    _swap_partition_uuid: {
        value: null
    },
    swap_partition_uuid: {
        set: function (value) {
            if (this._swap_partition_uuid !== value) {
                this._swap_partition_uuid = value;
            }
        },
        get: function () {
            return this._swap_partition_uuid;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "controller",
            valueType: "object"
        }, {
            mandatory: false,
            name: "data_partition_path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "data_partition_uuid",
            valueType: "String"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "empty",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "enclosure",
            valueType: "String"
        }, {
            mandatory: false,
            name: "encrypted",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "gdisk_name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "interface",
            valueType: "String"
        }, {
            mandatory: false,
            name: "is_encrypted",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "is_multipath",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "is_ssd",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "lunid",
            valueType: "String"
        }, {
            mandatory: false,
            name: "max_rotation",
            valueType: "number"
        }, {
            mandatory: false,
            name: "mediasize",
            valueType: "number"
        }, {
            mandatory: false,
            name: "model",
            valueType: "String"
        }, {
            mandatory: false,
            name: "multipath",
            valueType: "object"
        }, {
            mandatory: false,
            name: "partitions",
            valueObjectPrototypeName: "DiskPartition",
            valueType: "array"
        }, {
            mandatory: false,
            name: "schema",
            valueType: "String"
        }, {
            mandatory: false,
            name: "sectorsize",
            valueType: "number"
        }, {
            mandatory: false,
            name: "serial",
            valueType: "String"
        }, {
            mandatory: false,
            name: "smart_capable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "smart_enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "smart_status",
            valueType: "String"
        }, {
            mandatory: false,
            name: "swap_partition_path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "swap_partition_uuid",
            valueType: "String"
        }]
    }
});
