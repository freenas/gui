var Montage = require("montage/core/core").Montage;

exports.CryptoCertificate = Montage.specialize({
    _certificate: {
        value: null
    },
    certificate: {
        set: function (value) {
            if (this._certificate !== value) {
                this._certificate = value;
            }
        },
        get: function () {
            return this._certificate;
        }
    },
    _certificate_path: {
        value: null
    },
    certificate_path: {
        set: function (value) {
            if (this._certificate_path !== value) {
                this._certificate_path = value;
            }
        },
        get: function () {
            return this._certificate_path;
        }
    },
    _city: {
        value: null
    },
    city: {
        set: function (value) {
            if (this._city !== value) {
                this._city = value;
            }
        },
        get: function () {
            return this._city;
        }
    },
    _common: {
        value: null
    },
    common: {
        set: function (value) {
            if (this._common !== value) {
                this._common = value;
            }
        },
        get: function () {
            return this._common;
        }
    },
    _country: {
        value: null
    },
    country: {
        set: function (value) {
            if (this._country !== value) {
                this._country = value;
            }
        },
        get: function () {
            return this._country;
        }
    },
    _csr: {
        value: null
    },
    csr: {
        set: function (value) {
            if (this._csr !== value) {
                this._csr = value;
            }
        },
        get: function () {
            return this._csr;
        }
    },
    _csr_path: {
        value: null
    },
    csr_path: {
        set: function (value) {
            if (this._csr_path !== value) {
                this._csr_path = value;
            }
        },
        get: function () {
            return this._csr_path;
        }
    },
    _digest_algorithm: {
        value: null
    },
    digest_algorithm: {
        set: function (value) {
            if (this._digest_algorithm !== value) {
                this._digest_algorithm = value;
            }
        },
        get: function () {
            return this._digest_algorithm;
        }
    },
    _dn: {
        value: null
    },
    dn: {
        set: function (value) {
            if (this._dn !== value) {
                this._dn = value;
            }
        },
        get: function () {
            return this._dn;
        }
    },
    _email: {
        value: null
    },
    email: {
        set: function (value) {
            if (this._email !== value) {
                this._email = value;
            }
        },
        get: function () {
            return this._email;
        }
    },
    _key_length: {
        value: null
    },
    key_length: {
        set: function (value) {
            if (this._key_length !== value) {
                this._key_length = value;
            }
        },
        get: function () {
            return this._key_length;
        }
    },
    _lifetime: {
        value: null
    },
    lifetime: {
        set: function (value) {
            if (this._lifetime !== value) {
                this._lifetime = value;
            }
        },
        get: function () {
            return this._lifetime;
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
    _organization: {
        value: null
    },
    organization: {
        set: function (value) {
            if (this._organization !== value) {
                this._organization = value;
            }
        },
        get: function () {
            return this._organization;
        }
    },
    _privatekey: {
        value: null
    },
    privatekey: {
        set: function (value) {
            if (this._privatekey !== value) {
                this._privatekey = value;
            }
        },
        get: function () {
            return this._privatekey;
        }
    },
    _privatekey_path: {
        value: null
    },
    privatekey_path: {
        set: function (value) {
            if (this._privatekey_path !== value) {
                this._privatekey_path = value;
            }
        },
        get: function () {
            return this._privatekey_path;
        }
    },
    _selfsigned: {
        value: null
    },
    selfsigned: {
        set: function (value) {
            if (this._selfsigned !== value) {
                this._selfsigned = value;
            }
        },
        get: function () {
            return this._selfsigned;
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
    _signing_ca_id: {
        value: null
    },
    signing_ca_id: {
        set: function (value) {
            if (this._signing_ca_id !== value) {
                this._signing_ca_id = value;
            }
        },
        get: function () {
            return this._signing_ca_id;
        }
    },
    _signing_ca_name: {
        value: null
    },
    signing_ca_name: {
        set: function (value) {
            if (this._signing_ca_name !== value) {
                this._signing_ca_name = value;
            }
        },
        get: function () {
            return this._signing_ca_name;
        }
    },
    _state: {
        value: null
    },
    state: {
        set: function (value) {
            if (this._state !== value) {
                this._state = value;
            }
        },
        get: function () {
            return this._state;
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
    _valid_from: {
        value: null
    },
    valid_from: {
        set: function (value) {
            if (this._valid_from !== value) {
                this._valid_from = value;
            }
        },
        get: function () {
            return this._valid_from;
        }
    },
    _valid_until: {
        value: null
    },
    valid_until: {
        set: function (value) {
            if (this._valid_until !== value) {
                this._valid_until = value;
            }
        },
        get: function () {
            return this._valid_until;
        }
    }
});
