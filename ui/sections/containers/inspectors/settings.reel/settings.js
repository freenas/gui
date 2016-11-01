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

    save: {
        value: function () {
            return this._sectionService.saveSettings(this.object.settings)
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
