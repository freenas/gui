/**
 * @module ui/cron-rules.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CronRules
 * @extends Component
 */
exports.CronRules = Component.specialize(/** @lends CronRules# */ {

    handleAddRuleAction: {
        value: function () {
            console.log("add rule");
        }
    },

    handleDeleteEventAction: {
        value: function () {
            console.log("delete Event");
        }
    }
});
