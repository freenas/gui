var Montage = require("montage/core/core").Montage;
var CalendarTaskStatus = require("core/model/models/calendar-task-status").CalendarTaskStatus;

exports.CalendarTask = Montage.specialize({
    _args: {
        value: null
    },
    args: {
        set: function (value) {
            if (this._args !== value) {
                this._args = value;
            }
        },
        get: function () {
            return this._args;
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
    _hidden: {
        value: null
    },
    hidden: {
        set: function (value) {
            if (this._hidden !== value) {
                this._hidden = value;
            }
        },
        get: function () {
            return this._hidden;
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
    _protected: {
        value: null
    },
    protected: {
        set: function (value) {
            if (this._protected !== value) {
                this._protected = value;
            }
        },
        get: function () {
            return this._protected;
        }
    },
    _schedule: {
        value: null
    },
    schedule: {
        set: function (value) {
            if (this._schedule !== value) {
                this._schedule = value;
            }
        },
        get: function () {
            return this._schedule;
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
            return this._status || (this._status = new CalendarTaskStatus());
        }
    }
});
