/**
 * @module ui/sections/system/inspectors/alert.reel/alert-filter.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class AlertFilter
 * @extends AbstractInspector
 */
exports.AlertFilter = AbstractInspector.specialize(/** @lends AlertFilter# */ {
    enterDocument: {
        value: function (isFirstTime) {
            this.object.emitter = "EMAIL";
            if (!this.object.parameters) {
                this.object.parameters = {
                    "%type": "alert-emitter-email"
                };
            }
        }
    }
});
