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

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    this._mapObjectEnvironments(object.environment);
                }
            }
        },
        get: function () {
            return this._object;
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

            this._sectionService.getSerialTokenWithDockerContainer(this.object).then(function(token) {
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
    },

    _mapObjectEnvironments: {
        value: function (environments) {
            if (environments) {
                var data;

                this.environments = environments.map(function (environment) {
                    data = environment.match(/^(.+)=(.+)$/);

                    return {
                        variable: data[1],
                        value: data[2]
                    };
                });
            }
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
