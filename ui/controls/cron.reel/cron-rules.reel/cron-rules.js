/**
 * @module ui/cron-rules.reel
 */
var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    Rule = require("ui/controls/cron.reel/rule").Rule,
    CronRule = require("ui/controls/cron.reel/cron-rule.reel").CronRule;

/**
 * @class CronRules
 * @extends Component
 */
exports.CronRules = AbstractComponentActionDelegate.specialize(/** @lends CronRules# */ {

    enterDocument: {
        value: function() {
            this.rules = [];
            if (this.value) {
                var scheduleKeys = Object.keys(this.value),
                    key, value;
                scheduleKeys.sort()
                for (var i = 0, length = scheduleKeys.length; i < length; i++) {
                    key = scheduleKeys[i];
                    value = this.value[key];
                    if (value) {
                        rule = Rule.ParseString(value, Rule.CRON_FIELDS[Rule.SCHEDULE_TO_FIELD[key]]);
                        if (rule.field && (rule.type !== Rule.TYPES.EVERY || rule.values !== Rule.NO_INTERVAL)) {
                            this.rules.push(rule);
                        }
                    }
                }
            }
        }
    },

    exitDocument: {
        value: function() {
            this.rules.clear();
        }
    },

    removeField: {
        value: function(fieldName) {
            var field = Rule.CRON_FIELDS[fieldName];
            delete this.value[field.mapKey];
            this.dispatchOwnPropertyChange("value", this.value);
        }
    },

    updateField: {
        value: function(fieldName, type, values) {
            var field = Rule.CRON_FIELDS[fieldName],
                scheduleString = this._getScheduleString(type, values);
            if (scheduleString && field) {
                this.value[field.mapKey] = scheduleString;
                this.dispatchOwnPropertyChange("value", this.value);
            }
        }
    },

    handleAddRuleButtonAction: {
        value: function () {
            var rule = {};
            this.rules.push(rule);
        }
    },

    handleClearAllButtonAction: {
        value: function () {
            this.rules = [];
        }
    },

    removeRule: {
        value: function (rule) {
            var ruleIndex = this.rules.indexOf(rule);
            if(ruleIndex > -1) {
                this.rules.splice(ruleIndex, 1);
            }
            this.removeField(rule.field.name);
        }
    },

    _getScheduleString: {
        value: function(type, values) {
            var scheduleString = null;
            if (type === Rule.TYPES.ON && values.length > 0) {
                values.sort();
                scheduleString = values.join(',');
            } else if (type === Rule.TYPES.EVERY) {
                if (values.length === 1) {
                    if (values[0] === 1) {
                        scheduleString = '*';
                    } else {
                        scheduleString = '*'+'/' + values[0];
                    }
                }
            }
            return scheduleString;
        }
    }
});
