var Montage = require("montage").Montage;

exports.ZfsScan = Montage.specialize({
    _bytes_processed: {
        value: null
    },
    bytes_processed: {
        set: function (value) {
            if (this._bytes_processed !== value) {
                this._bytes_processed = value;
            }
        },
        get: function () {
            return this._bytes_processed;
        }
    },
    _bytes_to_process: {
        value: null
    },
    bytes_to_process: {
        set: function (value) {
            if (this._bytes_to_process !== value) {
                this._bytes_to_process = value;
            }
        },
        get: function () {
            return this._bytes_to_process;
        }
    },
    _end_time: {
        value: null
    },
    end_time: {
        set: function (value) {
            if (this._end_time !== value) {
                this._end_time = value;
            }
        },
        get: function () {
            return this._end_time;
        }
    },
    _errors: {
        value: null
    },
    errors: {
        set: function (value) {
            if (this._errors !== value) {
                this._errors = value;
            }
        },
        get: function () {
            return this._errors;
        }
    },
    _func: {
        value: null
    },
    func: {
        set: function (value) {
            if (this._func !== value) {
                this._func = value;
            }
        },
        get: function () {
            return this._func;
        }
    },
    _percentage: {
        value: null
    },
    percentage: {
        set: function (value) {
            if (this._percentage !== value) {
                this._percentage = value;
            }
        },
        get: function () {
            return this._percentage;
        }
    },
    _start_time: {
        value: null
    },
    start_time: {
        set: function (value) {
            if (this._start_time !== value) {
                this._start_time = value;
            }
        },
        get: function () {
            return this._start_time;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "bytes_processed",
            valueType: "number"
        }, {
            mandatory: false,
            name: "bytes_to_process",
            valueType: "number"
        }, {
            mandatory: false,
            name: "end_time",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "errors",
            valueType: "number"
        }, {
            mandatory: false,
            name: "func",
            valueType: "number"
        }, {
            mandatory: false,
            name: "percentage",
            valueType: "number"
        }, {
            mandatory: false,
            name: "start_time",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "state",
            valueType: "String"
        }]
    }
});
