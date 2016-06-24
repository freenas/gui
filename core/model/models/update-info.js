var Montage = require("montage/core/core").Montage;
var UpdateOps = require("core/model/models/update-ops").UpdateOps;

exports.UpdateInfo = Montage.specialize({
    _changelog: {
        value: null
    },
    changelog: {
        set: function (value) {
            if (this._changelog !== value) {
                this._changelog = value;
            }
        },
        get: function () {
            return this._changelog;
        }
    },
    _downloaded: {
        value: null
    },
    downloaded: {
        set: function (value) {
            if (this._downloaded !== value) {
                this._downloaded = value;
            }
        },
        get: function () {
            return this._downloaded;
        }
    },
    _notes: {
        value: null
    },
    notes: {
        set: function (value) {
            if (this._notes !== value) {
                this._notes = value;
            }
        },
        get: function () {
            return this._notes;
        }
    },
    _notice: {
        value: null
    },
    notice: {
        set: function (value) {
            if (this._notice !== value) {
                this._notice = value;
            }
        },
        get: function () {
            return this._notice;
        }
    },
    _operations: {
        value: null
    },
    operations: {
        set: function (value) {
            if (this._operations !== value) {
                this._operations = value;
            }
        },
        get: function () {
            return this._operations || (this._operations = new UpdateOps());
        }
    }
});
