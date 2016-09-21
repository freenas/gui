var Montage = require("montage").Montage;

exports.CalendarTaskScheduleAnonymous = Montage.specialize({
    _coalesce: {
        value: null
    },
    coalesce: {
        set: function (value) {
            if (this._coalesce !== value) {
                this._coalesce = value;
            }
        },
        get: function () {
            return this._coalesce;
        }
    },
    _day: {
        value: null
    },
    day: {
        set: function (value) {
            if (this._day !== value) {
                this._day = value;
            }
        },
        get: function () {
            return this._day;
        }
    },
    _day_of_week: {
        value: null
    },
    day_of_week: {
        set: function (value) {
            if (this._day_of_week !== value) {
                this._day_of_week = value;
            }
        },
        get: function () {
            return this._day_of_week;
        }
    },
    _hour: {
        value: null
    },
    hour: {
        set: function (value) {
            if (this._hour !== value) {
                this._hour = value;
            }
        },
        get: function () {
            return this._hour;
        }
    },
    _minute: {
        value: null
    },
    minute: {
        set: function (value) {
            if (this._minute !== value) {
                this._minute = value;
            }
        },
        get: function () {
            return this._minute;
        }
    },
    _month: {
        value: null
    },
    month: {
        set: function (value) {
            if (this._month !== value) {
                this._month = value;
            }
        },
        get: function () {
            return this._month;
        }
    },
    _second: {
        value: null
    },
    second: {
        set: function (value) {
            if (this._second !== value) {
                this._second = value;
            }
        },
        get: function () {
            return this._second;
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
    _week: {
        value: null
    },
    week: {
        set: function (value) {
            if (this._week !== value) {
                this._week = value;
            }
        },
        get: function () {
            return this._week;
        }
    },
    _year: {
        value: null
    },
    year: {
        set: function (value) {
            if (this._year !== value) {
                this._year = value;
            }
        },
        get: function () {
            return this._year;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "coalesce",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "day",
            valueType: "String"
        }, {
            mandatory: false,
            name: "day_of_week",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hour",
            valueType: "String"
        }, {
            mandatory: false,
            name: "minute",
            valueType: "String"
        }, {
            mandatory: false,
            name: "month",
            valueType: "String"
        }, {
            mandatory: false,
            name: "second",
            valueType: "String"
        }, {
            mandatory: false,
            name: "timezone",
            valueType: "String"
        }, {
            mandatory: false,
            name: "week",
            valueType: "String"
        }, {
            mandatory: false,
            name: "year",
            valueType: "String"
        }]
    }
});
