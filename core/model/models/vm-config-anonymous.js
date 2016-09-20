var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmConfigAnonymous = AbstractModel.specialize({
    _autostart: {
        value: null
    },
    autostart: {
        set: function (value) {
            if (this._autostart !== value) {
                this._autostart = value;
            }
        },
        get: function () {
            return this._autostart;
        }
    },
    _boot_device: {
        value: null
    },
    boot_device: {
        set: function (value) {
            if (this._boot_device !== value) {
                this._boot_device = value;
            }
        },
        get: function () {
            return this._boot_device;
        }
    },
    _boot_directory: {
        value: null
    },
    boot_directory: {
        set: function (value) {
            if (this._boot_directory !== value) {
                this._boot_directory = value;
            }
        },
        get: function () {
            return this._boot_directory;
        }
    },
    _boot_partition: {
        value: null
    },
    boot_partition: {
        set: function (value) {
            if (this._boot_partition !== value) {
                this._boot_partition = value;
            }
        },
        get: function () {
            return this._boot_partition;
        }
    },
    _bootloader: {
        value: null
    },
    bootloader: {
        set: function (value) {
            if (this._bootloader !== value) {
                this._bootloader = value;
            }
        },
        get: function () {
            return this._bootloader;
        }
    },
    _cloud_init: {
        value: null
    },
    cloud_init: {
        set: function (value) {
            if (this._cloud_init !== value) {
                this._cloud_init = value;
            }
        },
        get: function () {
            return this._cloud_init;
        }
    },
    _docker_host: {
        value: null
    },
    docker_host: {
        set: function (value) {
            if (this._docker_host !== value) {
                this._docker_host = value;
            }
        },
        get: function () {
            return this._docker_host;
        }
    },
    _memsize: {
        value: null
    },
    memsize: {
        set: function (value) {
            if (this._memsize !== value) {
                this._memsize = value;
            }
        },
        get: function () {
            return this._memsize;
        }
    },
    _ncpus: {
        value: null
    },
    ncpus: {
        set: function (value) {
            if (this._ncpus !== value) {
                this._ncpus = value;
            }
        },
        get: function () {
            return this._ncpus;
        }
    },
    _readme: {
        value: null
    },
    readme: {
        set: function (value) {
            if (this._readme !== value) {
                this._readme = value;
            }
        },
        get: function () {
            return this._readme;
        }
    },
    _vnc_password: {
        value: null
    },
    vnc_password: {
        set: function (value) {
            if (this._vnc_password !== value) {
                this._vnc_password = value;
            }
        },
        get: function () {
            return this._vnc_password;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "autostart",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "boot_device",
            valueType: "String"
        }, {
            mandatory: false,
            name: "boot_directory",
            valueType: "String"
        }, {
            mandatory: false,
            name: "boot_partition",
            valueType: "String"
        }, {
            mandatory: false,
            name: "bootloader",
            valueObjectPrototypeName: "VmConfigBootloader",
            valueType: "object"
        }, {
            mandatory: false,
            name: "cloud_init",
            valueType: "String"
        }, {
            mandatory: false,
            name: "docker_host",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "memsize",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ncpus",
            valueType: "number"
        }, {
            mandatory: false,
            name: "readme",
            valueType: "String"
        }, {
            mandatory: false,
            name: "vnc_password",
            valueType: "String"
        }]
    }
});
