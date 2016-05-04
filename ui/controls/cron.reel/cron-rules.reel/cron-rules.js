/**
 * @module ui/cron-rules.reel
 */
var Component = require("montage/ui/component").Component,
    Rule = require("ui/controls/cron.reel/rule").Rule,
    CronRule = require("ui/controls/cron.reel/cron-rule.reel").CronRule;

/**
 * @class CronRules
 * @extends Component
 */
exports.CronRules = Component.specialize(/** @lends CronRules# */ {

    _scheduleObject: {
        value: null
    },

    scheduleObject: {
        set: function (scheduleObject) {
            if (this._scheduleObject !== scheduleObject) {
                this._scheduleObject = scheduleObject;

                if (scheduleObject) {
                    this._initRulesIfNeeded();
                    this._mapRulesWithScheduleObject(scheduleObject);
                } else {
                    this._resetRules();
                }
            }
        },
        get: function () {
            return this._scheduleObject;
        }
    },

    rules: {
        value: null
    },

    enterDocument: {
        value: function () {
            this._initRulesIfNeeded();
        }
    },

    _initRulesIfNeeded: {
        value: function () {
            if (!this.rules) {
                this.rules = [];
            }

            if (!this.rules.length) {
                var cronFields = Rule.CRON_FIELDS,
                    cronFieldKeys = Object.keys(cronFields),
                    rule;

                for (var i = 0, length = cronFieldKeys.length; i < length; i++) {
                    rule = new Rule();
                    rule.field = cronFields[cronFieldKeys[i]];
                    this.rules.push(rule);
                }
            }
        }
    },

    _mapRulesWithScheduleObject: {
        value: function (scheduleObject) {
            if (this.rules) {
                var cronFields = Rule.CRON_FIELDS,
                    cronFieldKeys = Object.keys(cronFields),
                    cronField, rawData, values, mapValues,
                    parsedValues, rule, i, l, ii, ll;

                for (i = 0, l = cronFieldKeys.length; i < l; i++) {
                    cronField = cronFields[cronFieldKeys[i]];
                    rule = this.rules[cronField.index];
                    rawData = scheduleObject[cronField.mapKey];//need to be parsed.

                    rule.values.clear();

                    if (rawData) {
                        var parsedString = Rule.ParseString(rawData, cronField);
                        rule.type = parsedString.type;

                        if (rule.type === Rule.TYPES.EVERY) {
                            rule.values = parsedString.values;
                        } else {
                            values = Rule.FIELD_VALUES[cronField.index];
                            parsedValues = parsedString.values;
                            mapValues = [];

                            for (ii = 0, ll = parsedValues.length; ii < ll; ii++) {
                                mapValues.push(values[parsedValues[ii]]);
                            }

                            rule.values = mapValues;
                        }
                    }
                }
            }
        }
    },

    _resetRules: {
        value: function () {
            if (this.rules) {
                var rule;

                for (var i = 0, l = this.rules.length; i < length; i++) {
                    rule = this.rules[i];
                    rule.values.clear();
                    rule.type = Rule.TYPES.EVERY;
                }
            }
        }
    }

});
