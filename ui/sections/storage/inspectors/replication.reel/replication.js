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
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            this.super(isFirstTime);
            this.isLoading = true;
            return this._peeringService.list().then(function(peers) {
                self.peers = peers;
                if (self.peers && self.peers.length && !self.object.slave) {
                    self.object.slave = self.peers[0].id;
                }

                self._transportOptions = self._replicationService.extractTransportOptions(self.object);
                self._repetition = 0;
                self.repetitionUnits = Units.HOURS;

                if (self.context.dataset) {
                    self.object.datasets[0].master = self.context.dataset;
                    self._hideSourceDataset = true;
                }

                if (self.datasetTreeController) {
                    self.datasetTreeController.open(self.context.volume || self.object.datasets[0].master);
                }

                if (self.object._calendarTask ) {
                    self.calendarTask = self.object._calendarTask;
                    self.extraDeleteFlags = [{
                        "label": "Delete associated replication calendar task?",
                        "value": "delete_task",
                        "checked": false
                    }];
                } else {
                    self.calendarTask = null;
                    self.extraDeleteFlags = [];
                }
                self.isLoading = false;
            });
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
                .finally(function() {
                    self.syncTask = null;
                });
        }
    },

    save: {
        value: function() {
            var self = this;

            return this.saveReplication().then(function(replicationId) {
                if (replicationId && self.object._isNew) {
                    return self._repetition > 0 ?
                        self._calendarService.createNewRepeatedTask('replication.sync', self.object.name, [replicationId], self._repetition) :
                        self.syncReplication(replicationId);
                }
            });
        }
    },

    delete: {
        value: function(object) {
            if (this.calendarTask && this.extraDeleteFlags[0].checked) {
                this._sectionService.deleteCalendarTask(this.calendarTask);
            }
            this.inspector.delete();
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
