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
                this._object = object;
                if (object) {
                    if (object.template) {
                        this.templateName = object.template.name;
                    }
                    if (object.config) {
                        if (object._isNew) {
                            this.memorySize = object.config.memsize;
                        } else {
                            if (typeof this.object.config.memsize === "number") {
                                this.memorySize = this._convertMemsizeToString(this.object.config.memsize);
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
            if (this.object._isNew && this._templateName !== templateName) {
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
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                loadingPromises = [],
                devicesPromise;
            this.isLoading = true;
            this.editMode = this.object._isNew ? "edit" : "display";
            if (!this.object.config) {
                this.object.config = {ncpus: ""};
            }
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
            }
            Promise.all(loadingPromises).then(function() {
                self.isLoading = false;
            });
        }
    },

    exitDocument: {
        value: function() {
            this.templateName = null;
            this.memorySize = null;
            this.webvncConsole = null;
        }
    },

    _populateObjectWithTemplate: {
        value: function(template) {
            this.object.config = {};
            this.memorySize = this._convertMemsizeToString(template.config.memsize);
            this.object.config.memsize = template.config.memsize;
            this.object.config.ncpus = template.config.ncpus;
            this.object.template = {name: template.template.name};
            this.object.guest_type = template.guest_type;
            // FIXME: Contaminates the template
            this.object.devices = template.devices;
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
            var parsedMemsize = this._memorySize.toString().match(this.application.storageService.SCALED_NUMERIC_RE_),
                memsize,
                memsizePrefix,
                memsizeMultiplier = 1,
                devices = this.object.devices;

            if (!!parsedMemsize) {
                memsize = parseInt(parsedMemsize[1]);
                if (!!parsedMemsize[2]) {
                    memsizePrefix = parsedMemsize[2].charAt(0).toUpperCase();
                    // We're going with 1024 no matter what. This is not up for
                    // further discussion.
                    memsizeMultiplier = Math.pow(1024, this.application.storageService.SIZE_PREFIX_EXPONENTS[memsizePrefix] - 2);
                }
            }

            for (var i=0, length=devices.length; i<length; i++) {
                if (!devices[i].id) {
                    devices[i].id = "Existing devices must have ids, but they aren't saved";
                }
                if (devices[i].type === "DISK" && !!devices[i].properties && typeof devices[i].properties.size === "string") {
                    devices[i].properties.size = this.application.storageService.convertSizeStringToBytes(devices[i].properties.size);
                }
            }

            this.object.config.memsize = memsize * memsizeMultiplier;
            this.object.template = this.templateName === "---" ? null : this.object.template;
            this.object.target = this.object.target === "---" ? null : this.object.target;
            this.application.dataService.saveDataObject(this.object);
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

    _convertMemsizeToString: {
        value: function(memsize) {
            var prefixIndex = 2,
                result = memsize,
                sizePrefixes = Object.keys(this.application.storageService.SIZE_PREFIX_EXPONENTS);

            while (result % 1024 === 0) {
                prefixIndex++;
                result = result / 1024;
            }

            for (var i = 1, length = sizePrefixes.length; i<=length; i++) {
                if (this.application.storageService.SIZE_PREFIX_EXPONENTS[sizePrefixes[i]] === prefixIndex) {
                    result += sizePrefixes[i] + "iB";
                    break;
                }
                result += "";
            }
            return result;
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
