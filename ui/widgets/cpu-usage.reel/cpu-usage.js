var Component = require("montage/ui/component").Component;

/**
 * @class CpuUsage
 * @extends Component
 */
exports.CpuUsage = Component.specialize({
    transformValue: {
        value: function(value) {
            return value / 100;
        }
    }
});
