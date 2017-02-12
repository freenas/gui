var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units'),
    _ = require('lodash');

exports.Replication = AbstractInspector.specialize({
    transferSpeedUnits: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.transferSpeedUnits = Units.TRANSFER_SPEED;
            this._calendarService = this.application.calendarService;
            this._replicationService = this.application.replicationService;
            this._peeringService = this.application.peeringService;

            return this._peeringService.list().then(function(peers) {
                self.peers = peers;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (this.peers && this.peers.length && !this.object.slave) {
                this.object.slave = this.peers[0].id;
            }

            this._transportOptions = this._replicationService.extractTransportOptions(this.object);
            this._repetition = null;

            if (this.context.dataset) {
                this.object.datasets[0].master = this.context.dataset;
                this._hideSourceDataset = true;
            }

            if (this.datasetTreeController) {
                this.datasetTreeController.open(this.object.datasets[0].master || this.context.volume);
            }
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
                self.object.transport_options = transportOptions;
                return self.inspector.save().then(function() {
                    if (self._repetition) {
                        self._calendarService.createNewRepeatedTask('replication.sync', self.object.name, [self.object.name], self._repetition);
                    }
                });
            });
        }
    }

});
