/**
 * @module ui/replication-creator.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class ReplicationCreator
 * @extends AbstractInspector
 */
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
        value: function() {
            var self = this;

            this.object._transportOptions = {};
            this.object._replicationOptions = {};

            this._loadParentDataset();

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
            var self = this,
                transportOptions = this._buildTransportOptions();

            return this._sectionService.replicateDataset(this.object._dataset, this.object._replicationOptions, transportOptions);
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
            var dataset = this._getCurrentDataset();
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
    }

});
