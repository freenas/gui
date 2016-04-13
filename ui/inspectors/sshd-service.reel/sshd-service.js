var Component = require("montage/ui/component").Component;

/**
 * @class SshdService
 * @extends Component
 */
exports.SshdService = Component.specialize({
    SFTP_LOG_FACILITIES: {
        get: function() {
            return [
                "DAEMON",
                "USER",
                "AUTH",
                "LOCAL0",
                "LOCAL1",
                "LOCAL2",
                "LOCAL3",
                "LOCAL4",
                "LOCAL5",
                "LOCAL6",
                "LOCAL7"
            ];
        }
    },

    SFTP_LOG_LEVELS: {
        get: function() {
            return [
                "QUIET",
                "FATAL",
                "ERROR",
                "INFO",
                "VERBOSE",
                "DEBUG",
                "DEBUG2",
                "DEBUG3"
            ];
        }
    }
});
