var Rule = exports.Rule = function Rule () {
    this.values = [];
};

Rule.CRON_FIELDS = {
    SEC: {
        name: "SEC",
        label: "Second(s)",
        mapKey: "second",
        index: 0,
        min: 0,
        max: 59
    },
    MIN: {
        value: "MIN",
        label: "Minute(s)",
        mapKey: "minute",
        index: 1,
        min: 0,
        max: 59
    },
    HOURS: {
        name: "HOURS",
        label: "Hour(s)",
        mapKey: "hour",
        index: 2,
        min: 0,
        max: 23
    },
    DAYS_OF_WEEK: {
        name: "DAYS_OF_WEEK",
        label: "Day(s) of the week",
        mapKey: "day_of_week",
        index: 3,
        min: 0,
        max: 6
    },
    DAYS_OF_MONTH: {
        name: "DAYS_OF_MONTH",
        label: "Day(s) of the month",
        mapKey: "day",
        index: 4,
        min: 1,
        max: 31
    },
    MONTHS: {
        name: "MONTHS",
        label: "Month(s)",
        mapKey: "month",
        index: 5,
        min: 1,
        max: 12
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
            {"value": 0, "label": "sun"},
            {"value": 1, "label": "mon"},
            {"value": 2, "label": "tues"},
            {"value": 3, "label": "wed"},
            {"value": 4, "label": "thurs"},
            {"value": 5, "label": "fri"},
            {"value": 6, "label": "sat"}
        ],
        _4: null,
        5: [
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
            return this._0 || (this._0 = _generateNumbers(Rule.CRON_FIELDS.SEC.min, Rule.CRON_FIELDS.SEC.max));
        }
    },

    1: {
        get: function () {
            return this[0];
        }
    },

    2: {
        get: function () {
            return this._2 || (this._2 = _generateNumbers(Rule.CRON_FIELDS.HOURS.min, Rule.CRON_FIELDS.HOURS.max));
        }
    },

    4: {
        get: function () {
            return this._4 || (this._4 = _generateNumbers(
                    Rule.CRON_FIELDS.DAYS_OF_MONTH.min, Rule.CRON_FIELDS.DAYS_OF_MONTH.max
                ));
        }
    }

});


Rule.ParseString = function (string, cronField) {
    var isAnyValue = string === "*",
        isNumber = !isNaN(string),
        dividerIndex, values;

    if (isAnyValue) {
        values = [0];
    } else if (isNumber) {
        values = [+string];
    } else if ((dividerIndex = string.indexOf("/")) !== -1) {
        var subString = string.substring(0, dividerIndex),
            divider = +(string.substring(dividerIndex + 1));

        if (subString.indexOf("-") !== -1) {
            values = _parseRange(_stringArrayToIntArray(subString.split("-")), divider);
        } else if (!isNaN(subString)) {
            values = _parseRange([+subString, +cronField.max], divider);
        } else if (subString === "*") {
            values = _parseRange([+cronField.min, +cronField.max], divider);
        } else if (subString.indexOf(",") !== -1) {
            values = _stringArrayToIntArray(subString.split(","));
            values = _mergeArray(values, _parseRange([values.splice(values.length - 1)[0], +cronField.max], divider));
        } else {
            console.warn("cron string not supported");
        }
    } else if (string.indexOf("-") !== -1) {
        values = _parseRange(string.split("-"));
    } else if (string.indexOf(",") !== -1) {
        values = _stringArrayToIntArray(string.split(","));
    } else {
        console.warn("cron string not supported");
    }

    return {
        type: isNumber || isAnyValue ? Rule.TYPES.EVERY : Rule.TYPES.ON,
        values: values
    };
};


function _parseRange (range, divider) {
    var from = range[0],
        to = range[1],
        values = [];

    if (divider) {
        var number = from;

        do {
            values.push(number);
        } while((number = number + divider) <= to)
    } else {
        for (var i = 0, length = from === 0 ? to + 1: to - from + 1; i < length; i++) {
            values.push(from++);
        }
    }

    return values;
}

function _stringArrayToIntArray (array) {
    for (var i = 0, length = array.length; i < length; i++) {
        array[i] = +array[i];
    }

    return array;
}

function _mergeArray (arrayA, arrayB) {
    for (var i = 0, length = arrayB.length; i < length; i++) {
        if (arrayA.indexOf(arrayB[i]) === -1) {
            arrayA.push(arrayB[i]);
        }
    }

    return arrayA;
}


Rule.prototype.field = null;
Rule.prototype.type = Rule.TYPES.EVERY;


Rule.prototype.toCronExpression = function () {
    var expression, value;

    if (this.values.length < 2) {
        value = this.values[0];
        expression = value === void 0 || value === 0 ? "*" : "" + value;
    } else {
        expression = this.values.join(",");
    }

    return expression;
};
