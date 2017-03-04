var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units'),
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService,
    DockerContainer = require('core/model/DockerContainer').DockerContainer,
    _ = require('lodash');

exports.Container = AbstractInspector.specialize({
    memoryUnits: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.memoryUnits = Units.MEGABYTE_SIZES;
            this.eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (this.object._isNew) {
                this.object.names = [];
                this.object.networks = [];
            } else {
                this.object._command = _.join(this.object.command, ' ');
                this.object._volumes = this._sectionService.getDisplayVolumeObjects(this.object.volumes);
            }
            this.object._environments = this.object.environment ? _.map(this.object.environment, function(environment) {
                var parts = environment.match(/^(.+)=(.+)$/);
                return { id: parts[1], value: parts[2] };
            }) : [];
            if (isFirstTime) {
                this.addPathChangeListener('object._selectedImage', this, '_handleSelectedImageChange');
            }
            this.containerChangeListener = this.eventDispatcherService.addEventListener(DockerContainer.getEventNames().change(this.object.id), this.handleContainerChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this.eventDispatcherService.removeEventListener(DockerContainer.getEventNames().change(this.object.id), this.containerChangeListener);
        }
    },

    _handleSelectedImageChange: {
        value: function() {
            if (this.object && this.object._selectedImage && this._inDocument) {
                var self = this;
                this.isLoading = true;
                this._sectionService.copyImageToContainer(this.object._selectedImage, this.object).then(function() {
                    self.isLoading = false;
                });
            }
        }
    },

    handleGenerateAction: {
        value: function () {
            var self = this;
            this.isGeneratingAddress = true;
            this._sectionService.generateMacAddress().then(function(macAddress) {
                self.isGeneratingAddress = false;
                self.object.bridge.macaddress = macAddress;
            });
        }
    },

    handleRestartAction: {
        value: function() {
            this._sectionService.restartContainer(this.object);
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

    handleContainerChange: {
        value: function(state) {
            this.object.running = state.get('running');
        }
    },

    save: {
        value: function() {
            this._sectionService.saveContainer(this.object);
        }
    }
});
