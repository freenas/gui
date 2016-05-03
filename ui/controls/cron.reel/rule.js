var Rule = exports.Rule = function Rule () {
    this.values = [];
};

Rule.CRON_FIELDS = {
    MIN: {
        value: "MIN",
        label: "Minute(s)",
        index: 0
    },
    HOURS: {
        name: "HOURS",
        label: "Hour(s)",
        index: 1
    },
    DAYS_OF_MONTH: {
        name: "DAYS_OF_MONTH",
        label: "Day(s) of the month",
        index: 2
    },
    MONTHS: {
        name: "MONTHS",
        label: "Month(s)",
        index: 3
    },
    DAYS_OF_WEEK: {
        name: "DAYS_OF_WEEK",
        label: "Day(s) of the week",
        index: 4
    }
};


Rule.TYPES = {
    EVERY: "EVERY",
    ON: "ON"
};


Rule.FIELD_VALUES = {
        _0: null,
        _1: null,
        _2: null,
        3: [
            {"value": 0, "label": "jan"},
            {"value": 1, "label": "feb"},
            {"value": 2, "label": "mar"},
            {"value": 3, "label": "apr"},
            {"value": 4, "label": "may"},
            {"value": 5, "label": "jun"},
            {"value": 6, "label": "jul"},
            {"value": 7, "label": "aug"},
            {"value": 8, "label": "sep"},
            {"value": 9, "label": "oct"},
            {"value": 10, "label": "nov"},
            {"value": 11, "label": "dec"}
        ],
        4: [
            {"value": 0, "label": "sun"},
            {"value": 1, "label": "mon"},
            {"value": 2, "label": "tues"},
            {"value": 3, "label": "wed"},
            {"value": 4, "label": "thurs"},
            {"value": 5, "label": "fri"},
            {"value": 6, "label": "sat"}
        ]
};


function _generateNumbers (min, max) {
    var numbers = [];

    for (var i = min; i <= max; i++) {
        numbers.push({"value": i, "label": i + ""});
    }

    return numbers;
}


Object.defineProperties(Rule.FIELD_VALUES, {

    0: {
        get: function () {
            return this._0 || (this._0 = _generateNumbers(0, 59));
        }
    },

    1: {
        get: function () {
            return this._1 || (this._1 = _generateNumbers(0, 23));
        }
    },

    2: {
        get: function () {
            return this._2 || (this._2 = _generateNumbers(1, 31));
        }
    }

});


Rule.prototype.field = null;
Rule.prototype.type = Rule.TYPES.EVERY;
