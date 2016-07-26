var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    VmGuestType = require("core/model/enumerations/vm-guest-type").VmGuestType,
    Dict = require("collections/dict").Dict;

/**
 * @class VirtualMachine
 * @extends Component
 */
exports.VirtualMachine = Component.specialize({
    editMode: {
        value: null
    },

    templates: {
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

    _templateName: {
        value: null
    },

    templateName: {
        set: function(templateName) {
            var templates = this.templates,
                template;
            if (templateName === null) {
                this._templateName = null;
            } else if (!!templates) {
                if (!this.object.template || this.object.template.name !== templateName) {
                    for (var i = 0, length = templates.length; i<length; i++) {
                        if (templates[i].template.name === templateName) {
                            template = templates[i];
                            this.object.config = {};
                            this.object.config.memsize = template.config.memsize;
                            this.object.config.ncpus = template.config.ncpus;
                            this.object.template = {name: template.template.name};
                            this.object.guest_type = template.guest_type;
                            this.object.devices = template.devices;
                            break;
                        }
                    }
                }
            } else {
                console.warn("Templates not loaded!");
            }
        },

        get: function() {
            return this._templateName;
        }
    },

    constructor: {
        value: function() {
            this._guestOptionLabels = new Dict({
                "linux32": "Linux (32-bit)",
                "linux64": "Linux (64-bit)",
                "freebsd32": "FreeBSD (32-bit)",
                "freebsd64": "FreeBSD (64-bit)",
                "netbsd32": "NetBSD (32-bit)",
                "netbsd64": "NetBSD (64-bit)",
                "openbsd32": "OpenBSD (32-bit)",
                "openbsd64": "OpenBSD (64-bit)",
                "windows64": "Windows (64-bit)",
                "solaris64": "Solaris (64-bit)",
                "other": "Other",
                "other32": "Other (32-bit)",
                "other64": "Other (64-bit)"
            });
            this._initializeGuestTypeOptions();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                loadingPromises = [],
                devicesPromise;
            this.isLoading = true;
            if (isFirstTime) {
                loadingPromises.push(this._loadTemplates(), this._loadVolumes());
            }
            if (!this.object.config) {
                this.object.config = {ncpus: ""};
            }
            if (!this.object.guest_type) {
                this.object.guest_type = "other";
            }
            devicesPromise = this._populateDeviceList();
            if (!!devicesPromise) {
                loadingPromises.push(devicesPromise);
            }
            if (loadingPromises.length > 0) {
                Promise.all(loadingPromises).then(function() {
                    self.isLoading = false;
                });
            } else {
                this.isLoading = false;
            }
            this.editMode = !!this.object._isNew ? "edit" : "display";
        }
    },

    exitDocument: {
        value: function() {
            this.templateName = null;
        }
    },

    _populateDeviceList: {
        value: function() {
            var self = this,
                dataService = this.application.dataService,
                devices = dataService.getEmptyCollectionForType(Model.VmDevice),
                devicePromises = [];
            if (!this.object.devices) {
                this.object.devices = devices;
            } else if (!this.object.devices._meta_data || this.object.devices._meta_data.collectionModelType !== devices._meta_data.collectionModelType) {
                if (Array.isArray(this.object.devices)) {
                    for (var i=0, devicesLength=this.object.devices.length; i<devicesLength; i++) {
                        devicePromises.push(this._populateDevice(devices, this.object.devices[i], i));
                    }
                }
                return Promise.all(devicePromises).then(function(){
                    self.object.devices = devices;
                });
            }
        }
    },

    _loadTemplates: {
        value: function() {
            var self = this;

            return this.application.virtualMachineService.getTemplates().then(function(templates) {
                self.templates = templates;
            });
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

    save: {
        value: function() {
            var parsedMemsize = this.object.config.memsize.toString().match(this.application.storageService.SCALED_NUMERIC_RE_),
                memsize,
                memsizePrefix,
                memsizeMultiplier = 1;

            if (!!parsedMemsize) {
                memsize = parseInt(parsedMemsize[1]);
                if (!!parsedMemsize[2]) {
                    memsizePrefix = parsedMemsize[2].charAt(0).toUpperCase();
                    // We're going with 1024 no matter what. This is not up for
                    // further discussion.
                    memsizeMultiplier = Math.pow(1024, this.application.storageService.SIZE_PREFIX_EXPONENTS[memsizePrefix] - 2);
                }
            }

            this.object.config.memsize = memsize * memsizeMultiplier;
            this.object.template = this.templateName === "---" ? null : this.object.template;
            this.object.target = this.object.target === "---" ? null : this.object.target;
            this.application.dataService.saveDataObject(this.object);
        }
    },

    _populateDevice: {
        value: function(devices, device, index) {
            var keys = Object.keys(device);
            return this.application.dataService.getNewInstanceForType(Model.VmDevice).then(function(newDevice) {
                if (!device._meta_data && device.constructor.Type !== newDevice.constructor.Type) {
                    for (var i=0, length = keys.length; i<length; i++) {
                        newDevice[keys[i]] = device[keys[i]];
                    }
                    newDevice._isNew = false;
                    devices[index] = newDevice;
                }
            });
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
    }
});
