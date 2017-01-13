var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.ContainerEditor = AbstractInspector.specialize({

    templateDidLoad: {
        value: function () {
            var self = this,
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;

            this._canDrawGate.setField(blockGateKey, false);

            Promise.all([
                this._sectionService.listDockerHosts(),
                this._sectionService.getNewDockerContainerLogs()
            ]).then(function (data) {
                self._dockerHosts = data[0];
                self._dockerContainerLogs = data[1];
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
            this.super(isFirstTime);
            if (this.object.memory_limit) {
                this.object.memory_limit = this.application.bytesService.convertSizeToString(this.object.memory_limit, this.application.bytesService.UNITS.M);
            }
        }
    },

    handleStartAction: {
        value: function() {
            this._sectionService.startContainer(this.object);
        }
    },

    handleStopAction: {
        value: function() {
            this._sectionService.stopContainer(this.object);
        }
    },

    handleSerialConsoleAction: {
        value: function() {
            var self = this;

            this._sectionService.getInteractiveSerialTokenWithDockerContainer(this.object).then(function(token) {
                window.open(self._sectionService.getSerialConsoleUrl(token), self.object.names[0] + " Serial Console");
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
