var Component = require("montage/ui/component").Component,
    Units = require('core/Units');

exports.ReplicationArgs = Component.specialize({
    // _object: {
    //     value: null
    // },

    // object: {
    //     get: function() {
    //         return this._object;
    //     },
    //     set: function(object) {
    //         if (this._object[0] !== object[0]) {
    //             this._object = object;
    //             this._loadReplicationObject();
    //         }
    //     }
    // },

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

    _loadReplicationObject: {
        value: function () {
            var self = this;

            this.isLoading = true;
            this.replicationService.findOrCreateReplication(this.object[0]).then(function(replication) {
                self.isLoading = false;

                self.replicationObject = replication;
                self._transportOptions = self.replicationService.extractTransportOptions(self.replicationObject);

                self._ensureSlavePeerSet();                
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);

            this._loadReplicationObject();
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
