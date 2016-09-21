var Montage = require("montage").Montage;

exports.UpdateProgress = Montage.specialize({
    _details: {
        value: null
    },
    details: {
        set: function (value) {
            if (this._details !== value) {
                this._details = value;
            }
        },
        get: function () {
            return this._details;
        }
    },
    _error: {
        value: null
    },
    error: {
        set: function (value) {
            if (this._error !== value) {
                this._error = value;
            }
        },
        get: function () {
            return this._error;
        }
    },
    _filesize: {
        value: null
    },
    filesize: {
        set: function (value) {
            if (this._filesize !== value) {
                this._filesize = value;
            }
        },
        get: function () {
            return this._filesize;
        }
    },
    _finished: {
        value: null
    },
    finished: {
        set: function (value) {
            if (this._finished !== value) {
                this._finished = value;
            }
        },
        get: function () {
            return this._finished;
        }
    },
    _indeterminate: {
        value: null
    },
    indeterminate: {
        set: function (value) {
            if (this._indeterminate !== value) {
                this._indeterminate = value;
            }
        },
        get: function () {
            return this._indeterminate;
        }
    },
    _num_files_done: {
        value: null
    },
    num_files_done: {
        set: function (value) {
            if (this._num_files_done !== value) {
                this._num_files_done = value;
            }
        },
        get: function () {
            return this._num_files_done;
        }
    },
    _num_files_total: {
        value: null
    },
    num_files_total: {
        set: function (value) {
            if (this._num_files_total !== value) {
                this._num_files_total = value;
            }
        },
        get: function () {
            return this._num_files_total;
        }
    },
    _operation: {
        value: null
    },
    operation: {
        set: function (value) {
            if (this._operation !== value) {
                this._operation = value;
            }
        },
        get: function () {
            return this._operation;
        }
    },
    _percent: {
        value: null
    },
    percent: {
        set: function (value) {
            if (this._percent !== value) {
                this._percent = value;
            }
        },
        get: function () {
            return this._percent;
        }
    },
    _pkg_name: {
        value: null
    },
    pkg_name: {
        set: function (value) {
            if (this._pkg_name !== value) {
                this._pkg_name = value;
            }
        },
        get: function () {
            return this._pkg_name;
        }
    },
    _pkg_version: {
        value: null
    },
    pkg_version: {
        set: function (value) {
            if (this._pkg_version !== value) {
                this._pkg_version = value;
            }
        },
        get: function () {
            return this._pkg_version;
        }
    },
    _reboot: {
        value: null
    },
    reboot: {
        set: function (value) {
            if (this._reboot !== value) {
                this._reboot = value;
            }
        },
        get: function () {
            return this._reboot;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "details",
            valueType: "String"
        }, {
            mandatory: false,
            name: "error",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "filesize",
            valueType: "number"
        }, {
            mandatory: false,
            name: "finished",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "indeterminate",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "num_files_done",
            valueType: "number"
        }, {
            mandatory: false,
            name: "num_files_total",
            valueType: "number"
        }, {
            mandatory: false,
            name: "operation",
            valueObjectPrototypeName: "UpdateProgressOperation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "percent",
            valueType: "number"
        }, {
            mandatory: false,
            name: "pkg_name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "pkg_version",
            valueType: "String"
        }, {
            mandatory: false,
            name: "reboot",
            valueType: "boolean"
        }]
    }
});
