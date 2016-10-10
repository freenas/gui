/**
 * @module ui/scrub-args.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class ReplicationArgs
 * @extends Component
 */
exports.ReplicationArgs = Component.specialize(/** @lends ReplicationArgs# */ {
    compress: {
        value: null
    },

    encrypt: {
        value: null
    },

    throttle: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this.peersPromise = this.application.peeringService.list().then(function(peers) {
                return self.peers = peers;
            });
            this._dataService = this.application.dataService;
        }
    },

    enterDocument: {
        value: function() {
            this.isLoading = true;
            var self = this;
            var argsInitializationPromise;
            if (!this.args || this.args.length != 4) {
                argsInitializationPromise = this.peersPromise.then(function() {
                    return self._dataService.getNewInstanceForType(Model.ReplicationOptions);
                }).then(function(replicationOptions) {
                    if (self.peers.length > 0) {
                        replicationOptions.peer = self.peers[0].id;
                    }
                    self.args = [null, replicationOptions, [], false];
                });
            } else {
                argsInitializationPromise = Promise.resolve();
            }
            argsInitializationPromise.then(function() {
                if (self.datasetTreeController) {
                    self.datasetTreeController.open(self.args[0]);
                }
                self._extractTransportOptions();
                self.addPathChangeListener("compress", self, "_buildTransportOptions");
                self.addPathChangeListener("encrypt", self, "_buildTransportOptions");
                self.addPathChangeListener("throttle", self, "_buildTransportOptions");
                self.isLoading = false;
            });
        }
    },

    _extractTransportOptions: {
        value: function() {
            var transportOptions = this.args[2],
                option,
                length = transportOptions ? transportOptions.length || Object.keys(transportOptions).length : 0;
            for (var i = 0; i < length; i++) {
                option = transportOptions[i];
                if (option.name === "compress-replication-transport-plugin") {
                    this.compress = option.level;
                } else if (option.name === "encrypt-replication-transport-plugin") {
                    this.encrypt = option.type;
                } else if (option.name === "throttle-replication-transport-plugin") {
                    this.throttle = option.buffer_size;
                }
            }
        }
    },

    _buildTransportOptions: {
        value: function() {
            var transportOptions = [];
            if (this.encrypt) {
                transportOptions.push({
                    "%type": "encrypt-replication-transport-plugin",
                    type: this.encrypt
                });
            }
            if (this.compress) {
                transportOptions.push({
                    "%type": "compress-replication-transport-plugin",
                    level: this.compress
                });
            }
            if (this.throttle) {
                transportOptions.push({
                    "%type": "throttle-replication-transport-plugin",
                    buffer_size: this.throttle
                });
            }
            this.args[2] = transportOptions;
        }
    }
});
