var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units'),
    _ = require('lodash');

exports.Replication = AbstractInspector.specialize({
    transferSpeedUnits: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
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

    saveReplication: {
        value: function () {
            var self = this;

            if (this.object.bidirectional) {
                this.object.datasets[0].slave = this.object.datasets[0].master;
            } else {
                this.object.auto_recover = this.object.replicate_services = false;
            }

            return this._replicationService.buildTransportOptions(this._transportOptions).then(function(transportOptions) {
                self.object.transport_options = transportOptions;
                return self.inspector.save();
            }).then(function(submittedTask) {
                return submittedTask ? submittedTask.taskPromise : null;
            });
        }
    },

    syncReplication: {
        value: function (replicationId) {
            var self = this;

            return this._replicationService.syncReplication(replicationId)
                .then(function(submittedTask) {
                    self.syncTask = submittedTask;
                    return submittedTask.taskPromise;
                })
                .then(function() {
                    self.syncTask = null;
                });
        }
    },

    save: {
        value: function() {
            var self = this;

            this.saveReplication().then(function(replicationId) {
                if (replicationId && self.object._isNew) {
                    return self._repetition ?
                        self._calendarService.createNewRepeatedTask('replication.sync', self.object.name, [replicationId], self._repetition) :
                        self.syncReplication(replicationId);
                }
            });
        }
    },

    handleStartAction: {
        value: function () {
            var self = this,
                promise = this.object.id ? Promise.resolve(this.object.id) : this.saveReplication();

            return promise.then(function(replicationId) {
                if (replicationId) {
                   self.syncReplication(self.object.id);
                }
            });
        }
    }
});