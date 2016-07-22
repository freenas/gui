var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    VmGuestType = require("core/model/enumerations/vm-guest-type").VmGuestType;

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

    guestTypeOptions: {
        value: null
    },

    volumes: {
        value: null
    },

    _cpuSetting: {
        value: null
    },

    cpuSetting: {
        get: function() {
            if (typeof this._cpuSetting === "number") {
                return this._cpuSetting;
            } else if (!!this.object.config && !!this.object.config.ncpus) {
                return this.object.config.ncpus;
            }
            return "";
        },

        set: function(cpus) {
            this._cpuSetting = cpus;
        }
    },

    _guestTypeSetting: {
        value: null
    },

    guestTypeSetting: {
        get: function() {
            return !!this.object && !!this.object.guest_type ? this.object.guest_type : "other";
        },

        set: function(value) {
            this.object.guest_type = value;
        }

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

    templateSetting: {
        set: function(templateName) {
            var templates = this.templates,
                template;
            if (!!templates) {
                if (!this.object.template || this.object.template.name !== templateName) {
                    for (var i = 0, length = templates.length; i<length; i++) {
                        if (templates[i].template.name === templateName) {
                            template = templates[i];
                            this.object.config = new Object(template.config);
                            this.memorySetting = template.config.memsize + "MiB";
                            this.cpuSetting = template.config.ncpus;
                            this.object.template = {name: template.template.name};
                            this.object.guest_type = template.guest_type;
                            break;
                        }
                    }
                }
            } else {
                console.warn("Templates not loaded!");
            }
        },

        get: function() {
            return !!this.object.template ? this.object.template.name : "none";
        }
    },

    constructor: {
        value: function() {
            this._initializeGuestTypeOptions();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                loadingPromises = [];
            if (isFirstTime) {
                this.isLoading = true;
                loadingPromises.push(this._loadTemplates(), this._loadVolumes());
                Promise.all(loadingPromises).then(function() {
                    self.isLoading = false;
                });
            }
            if (!self.object.config) {
                self.object.config = {};
            }
            if (!!self.object._isNew) {
                self.templateSetting = "none";
            }

            this.editMode = !!this.object._isNew ? "edit" : "display";
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
            var parsedMemsize = this.memorySetting.match(this.application.storageService.SCALED_NUMERIC_RE_),
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
            this.object.config.ncpus = this.cpuSetting;
            this.object.template = this.object.template === "none" ? null : this.object.template ;
            this.object.target = this.object.target === "---" ? null : this.object.target;
            this.application.dataService.saveDataObject(this.object);
        }
    },

    _initializeGuestTypeOptions: {
        value: function() {
            var guestTypeOptions = [],
                optionStrings = VmGuestType.members;
            for (var i = 0, length = optionStrings.length; i < length; i++) {
                guestTypeOptions.push({value:optionStrings[i], label: optionStrings[i]});
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
