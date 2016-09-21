var Montage = require("montage").Montage;

exports.CalendarTaskStatus = Montage.specialize({
    _current_run_progress: {
        value: null
    },
    current_run_progress: {
        set: function (value) {
            if (this._current_run_progress !== value) {
                this._current_run_progress = value;
            }
        },
        get: function () {
            return this._current_run_progress;
        }
    },
    _current_run_status: {
        value: null
    },
    current_run_status: {
        set: function (value) {
            if (this._current_run_status !== value) {
                this._current_run_status = value;
            }
        },
        get: function () {
            return this._current_run_status;
        }
    },
    _last_run_status: {
        value: null
    },
    last_run_status: {
        set: function (value) {
            if (this._last_run_status !== value) {
                this._last_run_status = value;
            }
        },
        get: function () {
            return this._last_run_status;
        }
    },
    _next_run_time: {
        value: null
    },
    next_run_time: {
        set: function (value) {
            if (this._next_run_time !== value) {
                this._next_run_time = value;
            }
        },
        get: function () {
            return this._next_run_time;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "current_run_progress",
            valueType: "object"
        }, {
            mandatory: false,
            name: "current_run_status",
            valueType: "String"
        }, {
            mandatory: false,
            name: "last_run_status",
            valueType: "String"
        }, {
            mandatory: false,
            name: "next_run_time",
            valueType: "String"
        }]
    }
});
