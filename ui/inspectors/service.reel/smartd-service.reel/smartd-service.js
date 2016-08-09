var Component = require("montage/ui/component").Component;

/**
 * @class SmartdService
 * @extends Component
 */
exports.SmartdService = Component.specialize({

    SMARTD_POWER_MODES: {
        get: function() {
            return [
                "NEVER",
                "SLEEP",
                "STANDBY",
                "IDLE"
            ];
        }
    }

});
