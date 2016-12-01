var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class VirtualMachine
 * @extends Component
 */
exports.VirtualMachine = AbstractInspector.specialize({
    editMode: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
            }
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this.DEFAULT_STRING = this._sectionService.DEFAULT_STRING;
            this.guestTypeOptions = this._sectionService.GUEST_TYPES;
            this.bootloaderOptions = this._sectionService.BOOTLOADERS;
            return this._dependenciesLoadingPromise = this._load();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            this._startLoading();
            var self = this,
                loadingPromises = [
                    this._dependenciesLoadingPromise,
                    this._sectionService.setReadmeOnVm(this.object)
                ];

            this.editMode = this.object._isNew ? "edit" : "display";

            Promise.all(loadingPromises).then(function() {
                return self._sectionService.initializeVm(self.object);
            }).then(function() {
                self.addPathChangeListener("object._bootDevice", self, "_handleBootDeviceChange");
                self.addPathChangeListener("object._selectedTemplate", self, "_handleTemplateChange");
                self._cancelDevicesListener = self.addRangeAtPathChangeListener("object.devices", self, "_handleDevicesChange");
                self._cancelVolumeDevicesListener = self.addRangeAtPathChangeListener("object._volumeDevices", self, "_handleCategorizedDevicesChange");
                self._cancelNonVolumeDevicesListener = self.addRangeAtPathChangeListener("object._nonVolumeDevices", self, "_handleCategorizedDevicesChange");
                self._finishLoading();
            });

            if (isFirstTime) {
                this.object._isShutdownRequested = false;
                this.addPathChangeListener("object.status.state", this, "_handleStateChange");
            }
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            if (this.getPathChangeDescriptor('object._bootDevice', this)) {
                this.removePathChangeListener('object._bootDevice', this);
            }
            if (this.getPathChangeDescriptor('object._selectedTemplate', this)) {
                this.removePathChangeListener('object._selectedTemplate', this);
            }
            if (typeof this._cancelDevicesListener === 'function') {
                this._cancelDevicesListener();
                this._cancelDevicesListener = null;
            }
            if (typeof this._cancelVolumeDevicesListener === 'function') {
                this._cancelVolumeDevicesListener();
                this._cancelVolumeDevicesListener = null;
            }
            if (typeof this._cancelNonVolumeDevicesListener === 'function') {
                this._cancelNonVolumeDevicesListener();
                this._cancelNonVolumeDevicesListener = null;
            }
        }
    },

    revert: {
        value: function() {
            this.inspector.revert().then(function(vm) {
                vm._bootDevice = vm.config.boot_device;
            });
        }
    },

    save: {
        value: function() {
            var self = this;
            return this._sectionService.saveVm(this.object);
        }
    },

    handleStartAction: {
        value: function() {
            this._sectionService.startVm(this.object);
        }
    },

    handleStopAction: {
        value: function() {
            this._sectionService.stopVm(this.object, this.object._isShutdownRequested);
            this.object._isShutdownRequested = true;
        }
    },

    handleRebootAction: {
        value: function() {
            this._sectionService.rebootVm(this.object);
        }
    },

    handleSerialConsoleAction: {
        value: function() {
            var self = this;
            this._sectionService.getSerialConsoleForVm(this.object).then(function(serialConsole) {
                window.open(serialConsole, self.object.name + " Serial Console");
            });
        }
    },

    handleWebvncConsoleAction: {
        value: function() {
            var self = this;
            this._sectionService.getVncConsoleForVm(this.object).then(function(vncConsole) {
                window.open(vncConsole, self.object.name + " VM Console");
            });
        }
    },

    _handleStateChange: {
        value: function() {
            if (this.object.status && this.object.status.state === 'STOPPED') {
                this.object._isShutdownRequested = false;
            }
        }
    },

    _handleBootDeviceChange: {
        value: function() {
            if (this._inDocument && this.object.config && this.object.config.boot_device !== this.object._bootDevice) {
               this.object.config.boot_device = this.object._bootDevice;
            }
        }
    },

    _handleCategorizedDevicesChange: {
        value: function(addedDevices, removedDevices) {
            this._sectionService.addDevicesToVm(this.object, addedDevices);
            this._sectionService.removeDevicesFromVm(this.object, removedDevices);
        }
    },

    _handleDevicesChange: {
        value: function(addedDevices, removedDevices) {
            this._sectionService.categorizeDevices(this.object, addedDevices, removedDevices);
            var oldBootDevice = this.object._bootDevice;
            if (this._sectionService.updateBootDevices(this.object) && this.object.config) {
                this.object._bootDevice = oldBootDevice;
            }
        }
    },

    _handleTemplateChange: {
        value: function() {
            if (this.object._selectedTemplate) {
                var self = this;
                this.isloading = true;
                this._sectionService.populateVmWithTemplate(this.object, this.object._selectedTemplate).then(function() {
                    self.isLoading = false;
                });
            } else if (this.object._isNew) {
                this._sectionService.clearTemplateFromVm(this.object);
            }
        }
    },

    _load: {
        value: function() {
            var self = this;
            return Promise.all([
                this._sectionService.listVolumes().then(function(volumes) {
                    self.volumes = volumes;
                }),
                this._sectionService.listTemplates().then(function(templates) {
                    self.templates = templates.map(function(x) {
                        return {
                            label: x.template.name,
                            value: x
                        };
                    });
                })
            ]);
         }
    },

    _startLoading: {
        value: function() {
            this.isLoading = true;
            this._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, false);
        }
    },

    _finishLoading: {
        value: function() {
            this.isLoading = false;
            this._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, true);
        }
    }
}, {
    DRAW_GATE_FIELD: {
        value: "vmLoaded"
    }
});
