var Montage = require("montage/core/core").Montage;

exports.SystemTime = Montage.specialize({
    _boot_time: {
        value: null
    },
    boot_time: {
        set: function (value) {
            if (this._boot_time !== value) {
                this._boot_time = value;
            }
        },
        get: function () {
            return this._boot_time;
        }
    },
    _system_time: {
        value: null
    },
    system_time: {
        set: function (value) {
            if (this._system_time !== value) {
                this._system_time = value;
            }
        },
        get: function () {
            return this._system_time;
        }
    },
    _timezone: {
        value: null
    },
    timezone: {
        set: function (value) {
            if (this._timezone !== value) {
                this._timezone = value;
            }
        },
        get: function () {
            return this._timezone;
        }
    },
    _uptime: {
        value: null
    },
    uptime: {
        set: function (value) {
            if (this._uptime !== value) {
                this._uptime = value;
            }
        },
        get: function () {
            return this._uptime;
        }
    }
});
