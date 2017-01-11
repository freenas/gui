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
                    console.log(peers);
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
            var self = this;

            if (this.object.bidirectional) {
                this.object.datasets[0].slave = this.object.datasets[0].master;
            } else {
                this.object.auto_recover = this.object.replicate_services = false;
            }

            return this._replicationService.buildTransportOptions(this._transportOptions).then(function(transportOptions) {
                self.object.transportOptions = transportOptions;
                return self.inspector.save();
            });
        }
    }

});
