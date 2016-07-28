/**
 * @module ui/cron-rule.reel
 */
var Component = require("montage/ui/component").Component,
    Rule = require("ui/controls/cron.reel/rule").Rule;

var EMPTY_STRING = "";
/**
 * @class CronRule
 * @extends Component
 */
var CronRule = exports.CronRule = Component.specialize(/** @lends CronRule# */ {
    _on: {
        value: null
    },

    on: {
        get: function() {
            return this._on;
        },
        set: function(on) {
            if (this._on !== on) {
                this._on = on;
                if (this._selectedType === this.constructor.SELECTOR_TYPES.ON) {
                    this.value = on;
                }
            }
        }
    },

    _every: {
        value: null
    },

    every: {
        get: function() {
            return this._every;
        },
        set: function(every) {
            if (this._every !== every) {
                this._every = every;
                if (this._selectedType === this.constructor.SELECTOR_TYPES.EVERY) {
                    if (every > 1) {
                        this.value = '*/' + every;
                    } else {
                        this.value = '*';
                    }
                }
            }
        }
    },

    _selectedType: {
        value: null
    },

    selectedType: {
        get: function() {
            return this._selectedType;
        },
        set: function(selectedType) {
            if (this._selectedType !== selectedType) {
                this._selectedType = selectedType;
                if (selectedType) {
                    if (selectedType === this.constructor.SELECTOR_TYPES.ON) {
                        if (this._on) {
                            this.value = this._on;
                        } else {
                            if (this.displayOptions && this.displayOptions.length > 0) {
                                this.on = this.displayOptions[0].value;
                            } else {
                                this.on = null;
                            }
                        }
                    } else {
                        if (this._every) {
                            if (this._every > 1) {
                                this.value = '*/' + this._every;
                            } else {
                                this.value = '*';
                            }
                        } else {
                            this.every = 1;
                        }
                    }
                }
            }
        }
    },

    _minuteValues: {
        value: null
    },

    _dayValues: {
        value: null
    },

    _hourValues: {
        value: null
    },

    minuteValues: {
        get: function() {
            if (!this._minuteValues) {
                this._minuteValues = [];
                for(var i = 0; i < 60; i++) {
                    this._minuteValues.push(
                        { "value" : i }
                    );
                }
                return this._minuteValues;
            } else {
                return this._minuteValues
            }
        }
    },

    dayValues: {
        get: function() {
            if (!this._dayValues) {
                this._dayValues = [];
                for(var i = 1; i <= 31; i++) {
                    this._dayValues.push(
                        { "value" : i }
                    );
                }
                return this._dayValues;
            } else {
                return this._dayValues
            }
        }
    },

    hourValues: {
        get: function() {
            if (!this._hourValues) {
                this._hourValues = [];
                for(var i = 0; i < 24; i++) {
                    this._hourValues.push(
                        { "value" : i }
                    );
                }
                return this._hourValues;
            } else {
                return this._hourValues
            }
        }
    },

    daysOfWeek: {
        value: [
            {value: "Sun"},
            {value: "Mon"},
            {value: "Tues"},
            {value: "Wed"},
            {value: "Thur"},
            {value: "Fri"},
            {value: "Sat"}
        ]
    },

    enterDocument: {
        value: function () {
            if (!this.options) {
                if (typeof this.min === "number" && typeof this.max === "number") {
                    var options = [];
                    for (var i = this.min; i <= this.max; i++) {
                        options.push({value: i, label: i + EMPTY_STRING});
                    }
                    this.displayOptions = options;
                }
            } else {
                this.displayOptions = this.options.map(function(x, i) {
                    if (typeof x === "string") {
                        return {value: i, label: x};
                    } else {
                        return x;
                    }
                });
            }

            if (typeof this.value !== "string" && typeof this.value !== "number") {
                this.value = 0;
            }
            var parsedValue = parseInt(this.value);
            if (isNaN(parsedValue)) {
                var period = this.value.split('/')[1];
                this.type = this.constructor.SELECTOR_TYPES.EVERY;
                this.every = period ? +period : 1;
            } else {
                this.type = this.constructor.SELECTOR_TYPES.ON;
                this.on = parsedValue;
            }
        }
    },

    exitDocument: {
        value: function() {
            this._selectedType = null;
            this._on = null;
            this._every = null;
        }
    }

}, {

    MODES: {
        value: {
            EDITOR: "EDITOR",
            CREATOR: "CREATOR"
        }
    },

    _SELECTOR_OPTIONS: {
        value: null
    },

    SELECTOR_OPTIONS: {
        get: function () {
            if (!this._SELECTOR_OPTIONS) {
                this._SELECTOR_OPTIONS = [
                    {"value": this.SELECTOR_TYPES.EVERY, "label": "Every"},
                    {"value": this.SELECTOR_TYPES.ON, "label": "On"}
                ];
            }

            return this._SELECTOR_OPTIONS;
        }
    },

    _EMPTY_VALUE: {
        value: null
    },

    EMPTY_VALUE: {
        get: function() {
            if (!this._EMPTY_VALUE) {
                this._EMPTY_VALUE = { value: null, label: ' - ' };
            }
            return this._EMPTY_VALUE;
        }
    }

});


CronRule.SELECTOR_TYPES = Rule.TYPES;
CronRule.FIELD_VALUES = Rule.FIELD_VALUES;

