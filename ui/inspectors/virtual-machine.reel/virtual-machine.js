var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    VmConfigBootloader = require("core/model/enumerations/vm-config-bootloader").VmConfigBootloader,
    VmGuestType = require("core/model/enumerations/vm-guest-type").VmGuestType,
    Dict = require("collections/dict").Dict;

/**
 * @class VirtualMachine
 * @extends Component
 */
exports.VirtualMachine = AbstractInspector.specialize({
    editMode: {
        value: null
    },

    templates: {
        value: null
    },

    bootloaderOptions: {
        value: null
    },

    _guestOptionLabels: {
        value: null
    },

    guestTypeOptions: {
        value: null
    },

    volumes: {
        value: null
    },

    devices: {
        value: null
    },

    volumeDevices: {
        value: null
    },

    readme: {
        value: null
    },

    webvncConsole: {
        value: null
    },

    _memorySetting: {
        value: null
    },

    memorySetting: {
        get: function() {
            if (typeof this._memorySetting === "string") {
                return this._memorySetting;
            } else if (!!this.object.config && !!this.object.config.memsize) {
                return this.object.config.memsize + "MiB";
            }
            return "";
        },

        set: function(memorySetting) {
            this._memorySetting = memorySetting;
        }
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
                if (object) {
                    if (object.template) {
                        this.templateName = object.template.name;
                    }
                    if (object.config) {
                        if (object._isNew) {
                            this.memorySize = object.config.memsize;
                        } else {
                            if (typeof object.config.memsize === "number") {
                                this.memorySize = this.application.bytesService.convertMemsizeToString(object.config.memsize);
                            }
                        }
                    }
                    if (object.devices) {
                        for (var i=0, length=object.devices.length; i<length; i++) {
                            if (!object.devices[i].id) {
                                object.devices[i].id = "Existing devices must have ids, but they aren't saved";
                            }
                        }
                    }
                }
                this._object = object;
            }
        }
    },

    _memorySize: {
        value: null
    },

    memorySize: {
        get: function() {
            return this._memorySize;
        },
        set: function(memorySize) {
            if (this._memorySize !== memorySize) {
                this._memorySize = memorySize;
            }
        }
    },

    _templateName: {
        value: null
    },

    templateName: {
        get: function() {
            return this._templateName;
        },
        set: function(templateName) {
            var self = this;
            if (!!this.object && !!this.object._isNew && this._templateName !== templateName) {
                this._loadTemplates().then(function(templates) {
                    for (var i = 0, length = templates.length; i<length; i++) {
                        template = templates[i];
                        if (template.template.name === templateName) {
                            self._populateObjectWithTemplate(template);
                            break;
                        }
                    }
                });
            }
            this._templateName = templateName;
        }
    },

    templateDidLoad: {
        value: function() {
            this._consoleService = this.application.consoleService;
            this._guestOptionLabels = new Dict({
                "linux32":      "Linux (32-bit)",
                "linux64":      "Linux (64-bit)",
                "freebsd32":    "FreeBSD (32-bit)",
                "freebsd64":    "FreeBSD (64-bit)",
                "netbsd32":     "NetBSD (32-bit)",
                "netbsd64":     "NetBSD (64-bit)",
                "openbsd32":    "OpenBSD (32-bit)",
                "openbsd64":    "OpenBSD (64-bit)",
                "windows64":    "Windows (64-bit)",
                "solaris64":    "Solaris (64-bit)",
                "other":        "Other",
                "other32":      "Other (32-bit)",
                "other64":      "Other (64-bit)"
            });
            this._initializeGuestTypeOptions();
            this._loadTemplates();
            this.devices = this.application.dataService.getEmptyCollectionForType(Model.VmDevice);
            this.bootloaderOptions = VmConfigBootloader.members;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.superEnterDocument(isFirstTime);
            var self = this,
                loadingPromises = [];
            this.isLoading = true;
            this.editMode = this.object._isNew ? "edit" : "display";

            if (!this.object.guest_type) {
                this.object.guest_type = "other";
            }
            if (!this.object._isNew) {
                loadingPromises.push(this._loadWebvncConsole());
            }
            if (this.object._isNew) {
                if (!this.templates) {
                    loadingPromises.push(this._loadTemplates());
                }
                if (!this.volumes) {
                    loadingPromises.push(this._loadVolumes());
                }
                this.object.devices = this.application.dataService.getEmptyCollectionForType(Model.VmDevice);
                loadingPromises.push(this._convertReadme());
            } else {
                loadingPromises.push(this._convertReadme(this.object.config.readme));
            }
            loadingPromises.push(this._categorizeDevices());
            Promise.all(loadingPromises).then(function() {
                if (!self.object.config) {
                    self.object.config = {
                        ncpus: "",
                        bootloader: "GRUB"
                    };
                }
                self._updateBootDeviceOptions(self.object.config.boot_device);
                if (isFirstTime) {
                    self._cancelDeviceslistener = self.addRangeAtPathChangeListener("devices", self, "_handleDeviceChange");
                    self._cancelVolumesListener = self.addRangeAtPathChangeListener("volumeDevices", self, "_handleDeviceChange");
                }
                self.isLoading = false;
            });
        }
    },

    exitDocument: {
        value: function() {
            this.superExitDocument();
            this.templateName = null;
            this.memorySize = null;
            this.webvncConsole = null;
            this.readme = null;
            this.bootDevice = null;
        }
    },

    _populateObjectWithTemplate: {
        value: function(template) {
            var templatePromises = [];
            this.object.config = {};
            this.memorySize = this.application.bytesService.convertMemsizeToString(template.config.memsize);
            this.object.config.memsize = template.config.memsize;
            this.object.config.bootloader = template.config.bootloader;
            this.object.config.ncpus = template.config.ncpus;
            this.object.template = {name: template.template.name};
            this.object.guest_type = template.guest_type;
            templatePromises.push(this._convertReadme(template.template.readme));
            // FIXME: Contaminates the template
            for (var i=0, length=template.devices.length; i<length; i++) {
                template.devices[i].id = "This device came from a template";
                this.application.virtualMachineService.setDeviceDefaults(template.devices[i]);
            }
            this.object.devices = template.devices;
            templatePromises.push(this._categorizeDevices());
            return Promise.all(templatePromises);
        }
    },

    _loadTemplates: {
        value: function() {
            var self = this;
            if (!this._templatesPromise) {
                this._templatesPromise = this.application.virtualMachineService.getTemplates().then(function(templates) {
                    return self.templates = templates;
                });
            }
            return this._templatesPromise;
        }
    },

    _loadVolumes: {
        value: function() {
            var self = this;

            return this.application.dataService.fetchData(Model.Volume).then(function(volumes) {
                self.volumes = volumes;
            });
        }
    },

    _loadWebvncConsole: {
        value: function () {
            var self = this;
            Model.populateObjectPrototypeForType(Model.Vm).then(function(Vm) {
                return Vm.constructor.services.requestWebvncConsole(self.object.id);
            }).then(function(webvncConsole) {
                self.webvncConsole = webvncConsole;
            });
        }
    },

    save: {
        value: function() {
            var devices = this.devices.concat(this.volumeDevices);

            for (var i=0, length=devices.length; i<length; i++) {
                if (!devices[i].id) {
                    devices[i].id = "Existing devices must have ids, but they aren't saved";
                }
                if (devices[i].type === "DISK" && !!devices[i].properties && typeof devices[i].properties.size === "string") {
                    devices[i].properties.size = this.application.storageService.convertSizeStringToBytes(devices[i].properties.size);
                }
            }

            this.object.config.boot_device = this.bootDevice;
            if (this.object.config.boot_device === "---") {
                this.object.config.boot_device = null;
            }

            this.object.devices = devices;
            this.object.config.memsize = this.application.bytesService.convertStringToMemsize(this._memorySize);
            this.object.template = this.templateName === "---" ? null : this.object.template;
            this.object.target = this.object.target === "---" ? null : this.object.target;
            this.object.config.readme = this.readme.text;
            return this.application.dataService.saveDataObject(this.object);
        }
    },

    _initializeGuestTypeOptions: {
        value: function() {
            var guestTypeOptions = [],
                optionValues = VmGuestType.members,
                label;
            for (var i = 0, length = optionValues.length; i < length; i++) {
                label = this._guestOptionLabels.get(optionValues[i], optionValues[i]);
                guestTypeOptions.push({value: optionValues[i], label: label});
            }
            this.guestTypeOptions = guestTypeOptions;
        }
    },

    _categorizeDevices: {
        value: function() {
            var devices = this.object.devices,
                volumePromises = [];
            this.devices = this.application.dataService.getEmptyCollectionForType(Model.VmDevice);
            this.volumeDevices = this.application.dataService.getEmptyCollectionForType(Model.VmVolume);

            for (var i=0, length=devices.length; i<length; i++) {
                if (devices[i].type === "VOLUME") {
                    volumePromises.push(this._addConvertedVolume(devices[i]));
                } else {
                    this.devices.push(devices[i]);
                }
            }
            return Promise.all(volumePromises);
        }
    },

    _addConvertedVolume: {
        value: function(volumeDevice) {
            var self = this;
            return this._convertVolumeDevice(volumeDevice).then(function(volume) {
                self.volumeDevices.push(volume);
            });
        }
    },

    _convertVolumeDevice: {
        value: function(volumeDevice) {
            return this.application.dataService.getNewInstanceForType(Model.VmVolume).then(function(volume) {
                volume.type = "VOLUME";
                volume._isNew = volumeDevice._isNew;
                volume.name = volumeDevice.name;
                volume.properties = {
                    auto: volumeDevice.properties.auto,
                    destination: volumeDevice.properties.destination,
                    type: volumeDevice.properties.type,
                    source: volumeDevice.properties.source
                };
                return volume;
            });
        }
    },

    _handleDeviceChange: {
        value: function(plus, minus) {
            if (this.object.config) {
                var length, deviceIndex;
                for (i = 0, length = plus.length; i < length; i++) {
                    deviceIndex = this.object.devices.indexOf(plus[i]);
                    if (deviceIndex == -1) {
                        this.object.devices.push(plus[i]);
                    }
                }
                for (i = 0, length = minus.length; i < length; i++) {
                    deviceIndex = this.object.devices.indexOf(minus[i]);
                    if (deviceIndex != -1) {
                        this.object.devices.splice(deviceIndex, 1);
                    }
                }
                this._updateBootDeviceOptions();
            }
        }
    },

    _updateBootDeviceOptions: {
        value: function(selectedBootDevice) {
            selectedBootDevice = selectedBootDevice || this.bootDevice;
            var    bootDeviceOptions = [{ name: '---' }];
            if (this.devices) {
                bootDeviceOptions = bootDeviceOptions.concat(this.devices.filter(function(x) { return x.type == 'DISK' || x.type == 'CDROM'; }));
            }
            if (this.volumeDevices) {
                bootDeviceOptions = bootDeviceOptions.concat(this.volumeDevices);
            }
            this.bootDeviceOptions = bootDeviceOptions;
            this.bootDevice = selectedBootDevice;
        }
    },

    _convertReadme: {
        value: function(readmeText) {
            var self = this;
            return this.application.dataService.getNewInstanceForType(Model.VmReadme).then(function(readmeObject) {
                readmeObject.text = readmeText;
                self.readme = readmeObject;
            });
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

    handleRebootAction: {
        value: function() {
            this.object.services.reboot(this.object.id);
        }
    },

    handleSerialConsoleAction: {
        value: function() {
            var self = this;
            this._consoleService.getSerialToken(this.object.id).then(function(token) {
                window.open("/serial-console-app/#" + token, self.object.name + " Serial Console");
            });
        }
    },

    handleWebvncConsoleAction: {
        value: function() {
            window.open(this.webvncConsole, this.object.name + " VM Console");
        }
    }
});
