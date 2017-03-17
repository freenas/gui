var Component = require("montage/ui/component").Component,
    Units = require('core/Units');

exports.ReplicationArgs = Component.specialize({

    replicationService: {
        get: function () {
            return this._replicationService = this._replicationService || this.application.replicationService;
        }
    },

    templateDidLoad: {
        value: function() {
            var self = this;

            this.transferSpeedUnits = Units.TRANSFER_SPEED;
            this.application.peeringService.list().then(function(peers) {
                self.peers = peers;
                self._ensureSlavePeerSet();
            });
        }
    },

    _ensureSlavePeerSet: {
        value: function () {
            if (this.peers && this.peers.length && this.replicationObject && !this.replicationObject.slave) {
                this.replicationObject.slave = this.peers[0].id;
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);

            var self = this;

            this.isLoading = true;
            if (this.isNew) {
                this.object.clear();
            }
            this.replicationService.findOrCreateReplication(this.object[0]).then(function(replication) {

                self.replicationObject = replication;
                self._transportOptions = self.replicationService.extractTransportOptions(self.replicationObject);

                self._ensureSlavePeerSet();
                self.isLoading = false;
            });
        }
    },

    save: {
        value: function(object) {
            var self = this;

            return this.replicationService.buildTransportOptions(this._transportOptions).then(function(transportOptions) {
                self.replicationObject.name = self.replicationObject.name || object.name;
                self.replicationObject.transport_options = transportOptions;
                return self.replicationService.saveReplication(self.replicationObject);
            }).then(function(submittedTask) {
                return submittedTask.taskPromise;
            }).then(function(replicationId) {
                return [self.replicationObject.id || replicationId];
            });
        }
    }

});
