var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    Units = require('core/Units'),
    _ = require("lodash");

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

    guestInfoLoadAvg: {
        value: []
    },

    guestInfoInterfaces: {
        value: []
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.memoryUnits = Units.MEGABYTE_SIZES;
            this.DEFAULT_STRING = this._sectionService.DEFAULT_STRING;
            this.guestTypeOptions = this._sectionService.GUEST_TYPES;
            this.bootloaderOptions = this._sectionService.BOOTLOADERS;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            return this._dependenciesLoadingPromise = this._load();
        }
    },

    _getGuestInfo: {
        value: function() {
            var self = this;
            this._sectionService.getGuestInfo(self.object).then(function(guestInfo) {
                if (guestInfo) {
                    self.object.guestInfo = guestInfo
                    if (guestInfo.load_avg) {
                        self.guestInfoLoadAvg = [{
                                                    onemin: guestInfo.load_avg[0],
                                                    fivemin: guestInfo.load_avg[1],
                                                    tenmin: guestInfo.load_avg[2]
                                                }];
                        self.guestInfoInterfaces = _.map(
                        _.reject(_.toPairs(guestInfo.interfaces), {0: 'lo'}),
                        function (value, key)  {
                            return _.map(_.reject(value[1].aliases, {af: 'LINK'}),
                            function(alias) {
                                return {
                                    interface: value[0], type: alias.af, address: alias.address
                                };
                            });
                        })[0];
                    }
                }
            });
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
                self._sectionService.initializeVm(self.object);
                self.addRangeAtPathChangeListener("object.devices", self, "_handleDevicesChange");
                self.addPathChangeListener("object._bootDevice", self, "_handleBootDeviceChange");
                self.addPathChangeListener("object._selectedTemplate", self, "_handleTemplateChange");
                if (!self.object._isNew) {
                    self._getGuestInfo();
                }
                self._finishLoading();
            });

            this._changeListener = this._eventDispatcherService.addEventListener(ModelEventName.Vm.change(this.object.id), this._handleChange.bind(this));

            if (isFirstTime) {
                this.object._isShutdownRequested = false;
            }
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this._eventDispatcherService.removeEventListener(ModelEventName.Vm.change(this.object.id), this._changeListener);

            if (this.getPathChangeDescriptor('object._bootDevice', this)) {
                this.removePathChangeListener('object._bootDevice', this);
            }
            if (this.getPathChangeDescriptor('object._selectedTemplate', this)) {
                this.removePathChangeListener('object._selectedTemplate', this);
            }
            this.hasVmTools = false;
            this.guestInfoLoadAvg = [];
            this.guestInfoInterfaces = [];
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
            this._sectionService.getSerialConsoleUrl(this.object).then(function(serialConsoleUrl) {
                window.open(serialConsoleUrl, self.object.name + " Serial Console");
            });
        }
    },

    handleWebvncConsoleAction: {
        value: function() {
            var self = this;
            this._sectionService.getWebVncConsoleUrl(this.object).then(function(vncConsole) {
                window.open(vncConsole, self.object.name + " VM Console");
            });
        }
    },

    handleGuestInfoRefreshAction: {
        value: function() {
            this._getGuestInfo();
        }
    },

    _handleStateChange: {
        value: function() {
            if (this.object.status && this.object.status.state === 'STOPPED') {
                this.object._isShutdownRequested = false;
            }
        }
    },

    _handleDevicesChange: {
        value: function() {
            if (this._inDocument) {
                this._sectionService.updateBootDevices(this.object);
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
                this._sectionService.listDatastores().then(function(datastores) {
                    self.datastores = datastores;
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
    },

    _handleChange: {
        value: function(state) {
            _.assign(this.object, state.toJS());
        }
    }

}, {
    DRAW_GATE_FIELD: {
        value: "vmLoaded"
    }
});
