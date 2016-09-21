var Montage = require("montage").Montage;

exports.Rusage = Montage.specialize({
    _ru_idrss: {
        value: null
    },
    ru_idrss: {
        set: function (value) {
            if (this._ru_idrss !== value) {
                this._ru_idrss = value;
            }
        },
        get: function () {
            return this._ru_idrss;
        }
    },
    _ru_inblock: {
        value: null
    },
    ru_inblock: {
        set: function (value) {
            if (this._ru_inblock !== value) {
                this._ru_inblock = value;
            }
        },
        get: function () {
            return this._ru_inblock;
        }
    },
    _ru_isrss: {
        value: null
    },
    ru_isrss: {
        set: function (value) {
            if (this._ru_isrss !== value) {
                this._ru_isrss = value;
            }
        },
        get: function () {
            return this._ru_isrss;
        }
    },
    _ru_ixrss: {
        value: null
    },
    ru_ixrss: {
        set: function (value) {
            if (this._ru_ixrss !== value) {
                this._ru_ixrss = value;
            }
        },
        get: function () {
            return this._ru_ixrss;
        }
    },
    _ru_majflt: {
        value: null
    },
    ru_majflt: {
        set: function (value) {
            if (this._ru_majflt !== value) {
                this._ru_majflt = value;
            }
        },
        get: function () {
            return this._ru_majflt;
        }
    },
    _ru_maxrss: {
        value: null
    },
    ru_maxrss: {
        set: function (value) {
            if (this._ru_maxrss !== value) {
                this._ru_maxrss = value;
            }
        },
        get: function () {
            return this._ru_maxrss;
        }
    },
    _ru_minflt: {
        value: null
    },
    ru_minflt: {
        set: function (value) {
            if (this._ru_minflt !== value) {
                this._ru_minflt = value;
            }
        },
        get: function () {
            return this._ru_minflt;
        }
    },
    _ru_msgrcv: {
        value: null
    },
    ru_msgrcv: {
        set: function (value) {
            if (this._ru_msgrcv !== value) {
                this._ru_msgrcv = value;
            }
        },
        get: function () {
            return this._ru_msgrcv;
        }
    },
    _ru_msgsnd: {
        value: null
    },
    ru_msgsnd: {
        set: function (value) {
            if (this._ru_msgsnd !== value) {
                this._ru_msgsnd = value;
            }
        },
        get: function () {
            return this._ru_msgsnd;
        }
    },
    _ru_nivcsw: {
        value: null
    },
    ru_nivcsw: {
        set: function (value) {
            if (this._ru_nivcsw !== value) {
                this._ru_nivcsw = value;
            }
        },
        get: function () {
            return this._ru_nivcsw;
        }
    },
    _ru_nsignals: {
        value: null
    },
    ru_nsignals: {
        set: function (value) {
            if (this._ru_nsignals !== value) {
                this._ru_nsignals = value;
            }
        },
        get: function () {
            return this._ru_nsignals;
        }
    },
    _ru_nswap: {
        value: null
    },
    ru_nswap: {
        set: function (value) {
            if (this._ru_nswap !== value) {
                this._ru_nswap = value;
            }
        },
        get: function () {
            return this._ru_nswap;
        }
    },
    _ru_nvcsw: {
        value: null
    },
    ru_nvcsw: {
        set: function (value) {
            if (this._ru_nvcsw !== value) {
                this._ru_nvcsw = value;
            }
        },
        get: function () {
            return this._ru_nvcsw;
        }
    },
    _ru_oublock: {
        value: null
    },
    ru_oublock: {
        set: function (value) {
            if (this._ru_oublock !== value) {
                this._ru_oublock = value;
            }
        },
        get: function () {
            return this._ru_oublock;
        }
    },
    _ru_stime: {
        value: null
    },
    ru_stime: {
        set: function (value) {
            if (this._ru_stime !== value) {
                this._ru_stime = value;
            }
        },
        get: function () {
            return this._ru_stime;
        }
    },
    _ru_utime: {
        value: null
    },
    ru_utime: {
        set: function (value) {
            if (this._ru_utime !== value) {
                this._ru_utime = value;
            }
        },
        get: function () {
            return this._ru_utime;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "ru_idrss",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_inblock",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_isrss",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_ixrss",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_majflt",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_maxrss",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_minflt",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_msgrcv",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_msgsnd",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_nivcsw",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_nsignals",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_nswap",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_nvcsw",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_oublock",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_stime",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ru_utime",
            valueType: "number"
        }]
    }
});
