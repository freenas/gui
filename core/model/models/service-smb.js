var Montage = require("montage").Montage;

exports.ServiceSmb = Montage.specialize({
    _auxiliary: {
        value: null
    },
    auxiliary: {
        set: function (value) {
            if (this._auxiliary !== value) {
                this._auxiliary = value;
            }
        },
        get: function () {
            return this._auxiliary;
        }
    },
    _bind_addresses: {
        value: null
    },
    bind_addresses: {
        set: function (value) {
            if (this._bind_addresses !== value) {
                this._bind_addresses = value;
            }
        },
        get: function () {
            return this._bind_addresses;
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
    _dirmask: {
        value: null
    },
    dirmask: {
        set: function (value) {
            if (this._dirmask !== value) {
                this._dirmask = value;
            }
        },
        get: function () {
            return this._dirmask;
        }
    },
    _domain_logons: {
        value: null
    },
    domain_logons: {
        set: function (value) {
            if (this._domain_logons !== value) {
                this._domain_logons = value;
            }
        },
        get: function () {
            return this._domain_logons;
        }
    },
    _dos_charset: {
        value: null
    },
    dos_charset: {
        set: function (value) {
            if (this._dos_charset !== value) {
                this._dos_charset = value;
            }
        },
        get: function () {
            return this._dos_charset;
        }
    },
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
        }
    },
    _execute_always: {
        value: null
    },
    execute_always: {
        set: function (value) {
            if (this._execute_always !== value) {
                this._execute_always = value;
            }
        },
        get: function () {
            return this._execute_always;
        }
    },
    _filemask: {
        value: null
    },
    filemask: {
        set: function (value) {
            if (this._filemask !== value) {
                this._filemask = value;
            }
        },
        get: function () {
            return this._filemask;
        }
    },
    _guest_user: {
        value: null
    },
    guest_user: {
        set: function (value) {
            if (this._guest_user !== value) {
                this._guest_user = value;
            }
        },
        get: function () {
            return this._guest_user;
        }
    },
    _hostlookup: {
        value: null
    },
    hostlookup: {
        set: function (value) {
            if (this._hostlookup !== value) {
                this._hostlookup = value;
            }
        },
        get: function () {
            return this._hostlookup;
        }
    },
    _local_master: {
        value: null
    },
    local_master: {
        set: function (value) {
            if (this._local_master !== value) {
                this._local_master = value;
            }
        },
        get: function () {
            return this._local_master;
        }
    },
    _log_level: {
        value: null
    },
    log_level: {
        set: function (value) {
            if (this._log_level !== value) {
                this._log_level = value;
            }
        },
        get: function () {
            return this._log_level;
        }
    },
    _max_protocol: {
        value: null
    },
    max_protocol: {
        set: function (value) {
            if (this._max_protocol !== value) {
                this._max_protocol = value;
            }
        },
        get: function () {
            return this._max_protocol;
        }
    },
    _min_protocol: {
        value: null
    },
    min_protocol: {
        set: function (value) {
            if (this._min_protocol !== value) {
                this._min_protocol = value;
            }
        },
        get: function () {
            return this._min_protocol;
        }
    },
    _netbiosname: {
        value: null
    },
    netbiosname: {
        set: function (value) {
            if (this._netbiosname !== value) {
                this._netbiosname = value;
            }
        },
        get: function () {
            return this._netbiosname;
        }
    },
    _obey_pam_restrictions: {
        value: null
    },
    obey_pam_restrictions: {
        set: function (value) {
            if (this._obey_pam_restrictions !== value) {
                this._obey_pam_restrictions = value;
            }
        },
        get: function () {
            return this._obey_pam_restrictions;
        }
    },
    _sid: {
        value: null
    },
    sid: {
        set: function (value) {
            if (this._sid !== value) {
                this._sid = value;
            }
        },
        get: function () {
            return this._sid;
        }
    },
    _syslog: {
        value: null
    },
    syslog: {
        set: function (value) {
            if (this._syslog !== value) {
                this._syslog = value;
            }
        },
        get: function () {
            return this._syslog;
        }
    },
    _time_server: {
        value: null
    },
    time_server: {
        set: function (value) {
            if (this._time_server !== value) {
                this._time_server = value;
            }
        },
        get: function () {
            return this._time_server;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    },
    _unix_charset: {
        value: null
    },
    unix_charset: {
        set: function (value) {
            if (this._unix_charset !== value) {
                this._unix_charset = value;
            }
        },
        get: function () {
            return this._unix_charset;
        }
    },
    _unixext: {
        value: null
    },
    unixext: {
        set: function (value) {
            if (this._unixext !== value) {
                this._unixext = value;
            }
        },
        get: function () {
            return this._unixext;
        }
    },
    _workgroup: {
        value: null
    },
    workgroup: {
        set: function (value) {
            if (this._workgroup !== value) {
                this._workgroup = value;
            }
        },
        get: function () {
            return this._workgroup;
        }
    },
    _zeroconf: {
        value: null
    },
    zeroconf: {
        set: function (value) {
            if (this._zeroconf !== value) {
                this._zeroconf = value;
            }
        },
        get: function () {
            return this._zeroconf;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "bind_addresses",
            valueType: "array"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "dirmask",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "domain_logons",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "dos_charset",
            valueObjectPrototypeName: "ServiceSmbDoscharset",
            valueType: "object"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "execute_always",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "filemask",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "guest_user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostlookup",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "local_master",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "log_level",
            valueObjectPrototypeName: "ServiceSmbLoglevel",
            valueType: "object"
        }, {
            mandatory: false,
            name: "max_protocol",
            valueObjectPrototypeName: "ServiceSmbMaxprotocol",
            valueType: "object"
        }, {
            mandatory: false,
            name: "min_protocol",
            valueObjectPrototypeName: "ServiceSmbMinprotocol",
            valueType: "object"
        }, {
            mandatory: false,
            name: "netbiosname",
            valueType: "array"
        }, {
            mandatory: false,
            name: "obey_pam_restrictions",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "sid",
            valueType: "String"
        }, {
            mandatory: false,
            name: "syslog",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "time_server",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "unix_charset",
            valueObjectPrototypeName: "ServiceSmbUnixcharset",
            valueType: "object"
        }, {
            mandatory: false,
            name: "unixext",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "workgroup",
            valueType: "String"
        }, {
            mandatory: false,
            name: "zeroconf",
            valueType: "boolean"
        }]
    }
});
