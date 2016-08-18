/**
 * @module ui/cron-rules.reel
 */
var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delegate").AbstractComponentActionDelegate,
    Rule = require("ui/controls/cron.reel/rule").Rule,
    CronRule = require("ui/controls/cron.reel/cron-rule.reel").CronRule;

/**
 * @class CronRules
 * @extends Component
 */
exports.CronRules = AbstractComponentActionDelegate.specialize(/** @lends CronRules# */ {

    _value: {
        value: null
    },

    value: {
        get: function() {
            var result;
            if (this.rules) {
                var rule, resultString;
                result = {};
                for (var i = 0, length = this.rules.length; i < length; i++) {
                    rule = this.rules[i];
                    resultString = null;
                    if (rule.type === Rule.TYPES.ON && rule.values.length > 0) {
                        resultString = rule.values.join(',');
                    } else if (rule.type === Rule.TYPES.EVERY) {
                        if (rule.values.length === 1) {
                            if (rule.values[0] === 1) {
                                resultString = '*';
                            } else {
                                resultString = '*/' + rule.values[0];
                            }
                        }
                    }
                    if (resultString && resultString.length > 0) {
                        result[rule.field.mapKey] = resultString;
                    } 
                }
            }
            return result;
        },
        set: function(value) {
            if (this._value !== value) {
                this._value = value;
                this.rules = [];
                if (value) {
                    this._initRulesIfNeeded();    
                }
            }
        }
    },

    rules: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);
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
                    field, rule;

                for (var i = 0, length = cronFieldKeys.length; i < length; i++) {
                    field = cronFields[cronFieldKeys[i]];
                    value = this._value[field.mapKey];
                    if (value) {
                        rule = Rule.ParseString(value, field);
                        if (rule.type !== Rule.TYPES.EVERY || rule.values !== Rule.NO_INTERVAL) {
                            this.rules.push(rule);
                        }
                    }
                }
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
        }
    }

});
