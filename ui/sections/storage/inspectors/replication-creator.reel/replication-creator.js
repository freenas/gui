var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.ReplicationCreator = AbstractInspector.specialize(/** @lends ReplicationCreator# */ {

    _context: {
        value: null
    },

    context: {
        get: function() {
            return this._context;
        },
        set: function(context) {
            if (this._context != context) {
                this._context = context;
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this._calendarService = this.application.calendarService;
            }

            this.object._transportOptions = {};
            this.object._replicationOptions = {};

            this._loadParentDataset();
            this._resetRepetition();

            return this.application.peeringService.list().then(function(peers) {
                self.peers = peers;
                if (peers && peers.length) {
                    self.object._replicationOptions.peer = peers[0].id;
                }
            });
        }
    },

    save: {
        value: function() {
            var transportOptions = this._buildTransportOptions();

            return Promise.all([
                this._sectionService.replicateDataset(this.object._dataset, this.object._replicationOptions, transportOptions),
                this._repetition ? this._calendarService.createNewRepeatedTask(
                    'replication.replicate_dataset',
                    this.object._dataset + '@auto-rep',
                    [
                        this.object._dataset,
                        this.object._replicationOptions,
                        transportOptions
                    ],
                    this._repetition
                ) : Promise.resolve()
            ]);
        }
    },

    _buildTransportOptions: {
        value: function() {
            var transportOptions = [];
            if (this.object._transportOptions.encrypt) {
                transportOptions.push({
                    "%type": "encrypt-replication-transport-plugin",
                    type: this.object._transportOptions.encrypt
                });
            }
            if (this.object._transportOptions.compress) {
                transportOptions.push({
                    "%type": "compress-replication-transport-plugin",
                    level: this.object._transportOptions.compress
                });
            }
            if (this.object._transportOptions.throttle) {
                transportOptions.push({
                    "%type": "throttle-replication-transport-plugin",
                    buffer_size: this.object._transportOptions.throttle
                });
            }
            return transportOptions;
        }
    },

    _loadParentDataset: {
        value: function() {
            var dataset = this.selectionService.getClosestParentWithObjectType('VolumeDataset', this.context.columnIndex);
            if (dataset) {
                this.object._dataset = dataset.id;
            }
        }
    },

    _getCurrentDataset: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (currentSelection[i].constructor.Type == Model.VolumeDataset) {
                        return currentSelection[i];
                    }
                }
            }
        }
    },

    _resetRepetition: {
        value: function() {
            this._repetition = null;
        }
    }

});
