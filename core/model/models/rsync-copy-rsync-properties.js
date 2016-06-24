var Montage = require("montage/core/core").Montage;

exports.RsyncCopyRsyncProperties = Montage.specialize({
    _archive: {
        value: null
    },
    archive: {
        set: function (value) {
            if (this._archive !== value) {
                this._archive = value;
            }
        },
        get: function () {
            return this._archive;
        }
    },
    _compress: {
        value: null
    },
    compress: {
        set: function (value) {
            if (this._compress !== value) {
                this._compress = value;
            }
        },
        get: function () {
            return this._compress;
        }
    },
    _delay_updates: {
        value: null
    },
    delay_updates: {
        set: function (value) {
            if (this._delay_updates !== value) {
                this._delay_updates = value;
            }
        },
        get: function () {
            return this._delay_updates;
        }
    },
    _delete: {
        value: null
    },
    delete: {
        set: function (value) {
            if (this._delete !== value) {
                this._delete = value;
            }
        },
        get: function () {
            return this._delete;
        }
    },
    _extra: {
        value: null
    },
    extra: {
        set: function (value) {
            if (this._extra !== value) {
                this._extra = value;
            }
        },
        get: function () {
            return this._extra;
        }
    },
    _preserve_attributes: {
        value: null
    },
    preserve_attributes: {
        set: function (value) {
            if (this._preserve_attributes !== value) {
                this._preserve_attributes = value;
            }
        },
        get: function () {
            return this._preserve_attributes;
        }
    },
    _preserve_permissions: {
        value: null
    },
    preserve_permissions: {
        set: function (value) {
            if (this._preserve_permissions !== value) {
                this._preserve_permissions = value;
            }
        },
        get: function () {
            return this._preserve_permissions;
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
    _times: {
        value: null
    },
    times: {
        set: function (value) {
            if (this._times !== value) {
                this._times = value;
            }
        },
        get: function () {
            return this._times;
        }
    }
});
