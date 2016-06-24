var Montage = require("montage/core/core").Montage;

exports.RsyncdModule = Montage.specialize({
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
    _group: {
        value: null
    },
    group: {
        set: function (value) {
            if (this._group !== value) {
                this._group = value;
            }
        },
        get: function () {
            return this._group;
        }
    },
    _hosts_allow: {
        value: null
    },
    hosts_allow: {
        set: function (value) {
            if (this._hosts_allow !== value) {
                this._hosts_allow = value;
            }
        },
        get: function () {
            return this._hosts_allow;
        }
    },
    _hosts_deny: {
        value: null
    },
    hosts_deny: {
        set: function (value) {
            if (this._hosts_deny !== value) {
                this._hosts_deny = value;
            }
        },
        get: function () {
            return this._hosts_deny;
        }
    },
    _max_connections: {
        value: null
    },
    max_connections: {
        set: function (value) {
            if (this._max_connections !== value) {
                this._max_connections = value;
            }
        },
        get: function () {
            return this._max_connections;
        }
    },
    _mode: {
        value: null
    },
    mode: {
        set: function (value) {
            if (this._mode !== value) {
                this._mode = value;
            }
        },
        get: function () {
            return this._mode;
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
    _user: {
        value: null
    },
    user: {
        set: function (value) {
            if (this._user !== value) {
                this._user = value;
            }
        },
        get: function () {
            return this._user;
        }
    }
});
