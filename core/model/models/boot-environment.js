var Montage = require("montage/core/core").Montage;

exports.BootEnvironment = Montage.specialize({
    _active: {
        value: null
    },
    active: {
        set: function (value) {
            if (this._active !== value) {
                this._active = value;
            }
        },
        get: function () {
            return this._active;
        }
    },
    _created: {
        value: null
    },
    created: {
        set: function (value) {
            if (this._created !== value) {
                this._created = value;
            }
        },
        get: function () {
            return this._created;
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
    _mountpoint: {
        value: null
    },
    mountpoint: {
        set: function (value) {
            if (this._mountpoint !== value) {
                this._mountpoint = value;
            }
        },
        get: function () {
            return this._mountpoint;
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
    _on_reboot: {
        value: null
    },
    on_reboot: {
        set: function (value) {
            if (this._on_reboot !== value) {
                this._on_reboot = value;
            }
        },
        get: function () {
            return this._on_reboot;
        }
    },
    _space: {
        value: null
    },
    space: {
        set: function (value) {
            if (this._space !== value) {
                this._space = value;
            }
        },
        get: function () {
            return this._space;
        }
    }
});
