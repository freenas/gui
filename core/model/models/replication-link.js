var Montage = require("montage/core/core").Montage;
var ReplicationStatus = require("core/model/models/replication-status").ReplicationStatus;

exports.ReplicationLink = Montage.specialize({
    _bidirectional: {
        value: null
    },
    bidirectional: {
        set: function (value) {
            if (this._bidirectional !== value) {
                this._bidirectional = value;
            }
        },
        get: function () {
            return this._bidirectional;
        }
    },
    _datasets: {
        value: null
    },
    datasets: {
        set: function (value) {
            if (this._datasets !== value) {
                this._datasets = value;
            }
        },
        get: function () {
            return this._datasets;
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
    _master: {
        value: null
    },
    master: {
        set: function (value) {
            if (this._master !== value) {
                this._master = value;
            }
        },
        get: function () {
            return this._master;
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
    _partners: {
        value: null
    },
    partners: {
        set: function (value) {
            if (this._partners !== value) {
                this._partners = value;
            }
        },
        get: function () {
            return this._partners;
        }
    },
    _recursive: {
        value: null
    },
    recursive: {
        set: function (value) {
            if (this._recursive !== value) {
                this._recursive = value;
            }
        },
        get: function () {
            return this._recursive;
        }
    },
    _replicate_services: {
        value: null
    },
    replicate_services: {
        set: function (value) {
            if (this._replicate_services !== value) {
                this._replicate_services = value;
            }
        },
        get: function () {
            return this._replicate_services;
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
            return this._status || (this._status = new ReplicationStatus());
        }
    },
    _update_date: {
        value: null
    },
    update_date: {
        set: function (value) {
            if (this._update_date !== value) {
                this._update_date = value;
            }
        },
        get: function () {
            return this._update_date;
        }
    }
});
