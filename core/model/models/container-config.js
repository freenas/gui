var Montage = require("montage/core/core").Montage;

exports.ContainerConfig = Montage.specialize({
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
    _vnc_enabled: {
        value: null
    },
    vnc_enabled: {
        set: function (value) {
            if (this._vnc_enabled !== value) {
                this._vnc_enabled = value;
            }
        },
        get: function () {
            return this._vnc_enabled;
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
    },
    _vnc_port: {
        value: null
    },
    vnc_port: {
        set: function (value) {
            if (this._vnc_port !== value) {
                this._vnc_port = value;
            }
        },
        get: function () {
            return this._vnc_port;
        }
    }
});
