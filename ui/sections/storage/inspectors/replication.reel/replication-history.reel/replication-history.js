var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    bytes = require('bytes');

/**
 * @class ReplicationHistory
 * @extends Component
 */
exports.ReplicationHistory = AbstractInspector.specialize(/** @lends ReplicationHistory# */ {
    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
                if (object) {
                    this._history = this._extractHistory(object.status);
                }
            }
        }
    },

    _extractHistory: {
        value: function(status) {
            var history = [],
                i, entry;

            for (i = (status || []).length - 1; i >= 0; i--) {
                entry = status[i];
                history.push({
                    started: entry.started_at['$date'],
                    status: entry.status,
                    size: bytes(entry.size),
                    speed: bytes(entry.speed) + '/s'
                });
            }

            return history;
        }
    }
});
