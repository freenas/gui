var Montage = require("montage/core/core").Montage;

exports.Directory = Montage.specialize({
    _enabled: {
        value: null
    },
    enabled: {
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
            }
        },
        get: function () {
            return this._enabled;
        }
    },
    _enumerate: {
        value: null
    },
    enumerate: {
        set: function (value) {
            if (this._enumerate !== value) {
                this._enumerate = value;
            }
        },
        get: function () {
            return this._enumerate;
        }
    },
    _gid_range: {
        value: null
    },
    gid_range: {
        set: function (value) {
            if (this._gid_range !== value) {
                this._gid_range = value;
            }
        },
        get: function () {
            return this._gid_range;
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
    _parameters: {
        value: null
    },
    parameters: {
        set: function (value) {
            if (this._parameters !== value) {
                this._parameters = value;
            }
        },
        get: function () {
            return this._parameters;
        }
    },
    _plugin: {
        value: null
    },
    plugin: {
        set: function (value) {
            if (this._plugin !== value) {
                this._plugin = value;
            }
        },
        get: function () {
            return this._plugin;
        }
    },
    _priority: {
        value: null
    },
    priority: {
        set: function (value) {
            if (this._priority !== value) {
                this._priority = value;
            }
        },
        get: function () {
            return this._priority;
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
            return this._status;
        }
    },
    _uid_range: {
        value: null
    },
    uid_range: {
        set: function (value) {
            if (this._uid_range !== value) {
                this._uid_range = value;
            }
        },
        get: function () {
            return this._uid_range;
        }
    }
});
