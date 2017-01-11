/**
 * @module ui/replication.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Replication
 * @extends AbstractInspector
 */
exports.Replication = AbstractInspector.specialize(/** @lends Replication# */ {

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this._calendarService = this.application.calendarService;
                this._replicationService = this.application.replicationService;

                this.application.peeringService.list().then(function(peers) {
                    self.peers = peers;
                    if (peers && peers.length && !self.object.slave) {
                        self.object.slave = peers[0].id;
                    }
                });
            }

            this._transportOptions = this._replicationService.extractTransportOptions(this.object);
            this._repetition = null;
        }
    },

    save: {
        value: function() {
            this.object.master = 
            this._replicationService.setTransportOptions(this.object, this._transportOptions);

            return this.inspector.save();
        }
    }

});
