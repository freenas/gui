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
    }

});
