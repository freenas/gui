/**
 * @module ui/settings.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Settings
 * @extends Component
 */
exports.Settings = AbstractInspector.specialize(/** @lends Settings# */ {
    
    templateDidLoad: {
        value: function () {
            var self = this,
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;

            this._canDrawGate.setField(blockGateKey, false);

            this._sectionService.listDockerHosts().then(function (dockersHost) {
                self._availablesDockers = dockersHost;
                self._canDrawGate.setField(blockGateKey, true);
            });
        }
    },

    enterDocument: {
        value: function () {
            this.super();

            if (!this._getDefaultDockerCollectionPromise) {
                var self = this;
                this.isLoading = true;

                this._getDefaultDockerCollectionPromise = this._sectionService.getDefaultDockerCollection()
                .then(function (defaultCollection) {
                    self.defaultCollection = defaultCollection;
                }).finally(function () {
                    self.isLoading = false;
                    self._getDefaultDockerCollectionPromise = null;
                });
            }
        }
    },

    defaultCollection: {
        value: null
    },

    save: {
        value: function () {
            var self = this;

            return Promise.all([
                this._sectionService.getCurrentUser().then(function (user) {
                    if (user && user.attributes && user.attributes.defaultCollection !== self.defaultCollection) {
                        user.attributes.defaultCollection = self._defaultCollection;
                        return this._sectionService.saveCurrentUser();
                    }
                }), 
                this._sectionService.saveSettings(this.object.settings)
            ]);
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
