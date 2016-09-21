var Montage = require("montage").Montage;

exports.ServiceSshd = Montage.specialize({
    _allow_gssapi_auth: {
        value: null
    },
    allow_gssapi_auth: {
        set: function (value) {
            if (this._allow_gssapi_auth !== value) {
                this._allow_gssapi_auth = value;
            }
        },
        get: function () {
            return this._allow_gssapi_auth;
        }
    },
    _allow_password_auth: {
        value: null
    },
    allow_password_auth: {
        set: function (value) {
            if (this._allow_password_auth !== value) {
                this._allow_password_auth = value;
            }
        },
        get: function () {
            return this._allow_password_auth;
        }
    },
    _allow_port_forwarding: {
        value: null
    },
    allow_port_forwarding: {
        set: function (value) {
            if (this._allow_port_forwarding !== value) {
                this._allow_port_forwarding = value;
            }
        },
        get: function () {
            return this._allow_port_forwarding;
        }
    },
    _allow_pubkey_auth: {
        value: null
    },
    allow_pubkey_auth: {
        set: function (value) {
            if (this._allow_pubkey_auth !== value) {
                this._allow_pubkey_auth = value;
            }
        },
        get: function () {
            return this._allow_pubkey_auth;
        }
    },
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
    _permit_root_login: {
        value: null
    },
    permit_root_login: {
        set: function (value) {
            if (this._permit_root_login !== value) {
                this._permit_root_login = value;
            }
        },
        get: function () {
            return this._permit_root_login;
        }
    },
    _port: {
        value: null
    },
    port: {
        set: function (value) {
            if (this._port !== value) {
                this._port = value;
            }
        },
        get: function () {
            return this._port;
        }
    },
    _sftp_log_facility: {
        value: null
    },
    sftp_log_facility: {
        set: function (value) {
            if (this._sftp_log_facility !== value) {
                this._sftp_log_facility = value;
            }
        },
        get: function () {
            return this._sftp_log_facility;
        }
    },
    _sftp_log_level: {
        value: null
    },
    sftp_log_level: {
        set: function (value) {
            if (this._sftp_log_level !== value) {
                this._sftp_log_level = value;
            }
        },
        get: function () {
            return this._sftp_log_level;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "allow_gssapi_auth",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "allow_password_auth",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "allow_port_forwarding",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "allow_pubkey_auth",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "compression",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "permit_root_login",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "sftp_log_facility",
            valueObjectPrototypeName: "ServiceSshdSftplogfacility",
            valueType: "object"
        }, {
            mandatory: false,
            name: "sftp_log_level",
            valueObjectPrototypeName: "ServiceSshdSftploglevel",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
