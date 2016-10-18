/**
 * @module ui/container.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Container
 * @extends Component
 */
exports.Container = AbstractInspector.specialize({

    templateDidLoad: {
        value: function () {
            var self = this,
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;

            this._canDrawGate.setField(blockGateKey, false);

            this._sectionService.listDockerHosts().then(function (dockersHost) {
                self._dockerHosts = dockersHost;
                self._canDrawGate.setField(blockGateKey, true);
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super();

            if (this.object.memory_limit) {
                this.object.memory_limit = this.application.bytesService.convertSizeToString(this.object.memory_limit, this.application.bytesService.UNITS.M);
            }
        }
    },

    handleStartAction: {
        value: function() {
            this.object.services.start(this.object.id);
        }
    },

    handleStopAction: {
        value: function() {
            this.object.services.stop(this.object.id);
        }
    },

    handleSerialConsoleAction: {
        value: function() {
            var self = this;

            this.application.consoleService.getSerialToken(this.object.id).then(function(token) {
                window.open("/serial-console-app/#" + token, self.object.names[0] + " Serial Console");
            });
        }
    },

    handleWebUIAction: {
        value: function () {
            if (this.object.web_ui_url) {
                window.open(this.object.web_ui_url);
            }
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
