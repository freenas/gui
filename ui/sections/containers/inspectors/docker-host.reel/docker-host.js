var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units');

exports.DockerHost = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this.memoryUnits = Units.MEGABYTE_SIZES;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this.DEFAULT_STRING = this._sectionService.DEFAULT_STRING;

                this._sectionService.listDatastores().then(function(datastores) {
                    self._datastores = datastores;
                });
            }

            this._sectionService.initializeDockerHost(this.object);
        }
    },

    handleStartAction: {
        value: function() {
            this._sectionService.startDockerHost(this.object);
        }
    },

    handleStopAction: {
        value: function() {
            this._sectionService.stopDockerHost(this.object);
        }
    },

    handleKillAction: {
        value: function() {
            this._sectionService.killDockerHost(this.object);
        }
    },

    handleRebootAction: {
        value: function() {
            this._sectionService.rebootDockerHost(this.object);
        }
    },

    handleSerialConsoleAction: {
        value: function() {
            var self = this;
            this._sectionService.getSerialConsoleUrl(this.object).then(function(serialConsoleUrl) {
                window.open(serialConsoleUrl, self.object.name + " Serial Console");
            });
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveDockerHost(this.object);
        }
    }
});
