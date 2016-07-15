var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

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

    templatesOptions: {
        value: null
    },

    volumeOptions: {
        value: null
    },

    _cpuSetting: {
        value: null
    },

    cpuSetting: {
        get: function() {
            if (typeof this._cpuSetting === "string") {
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

    volumeSetting: {
        set: function(volumeName) {
            this.object.target = volumeName;
        },

        get: function() {
            return !!this.object.target ? this.object.target : "%";
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                loadingPromises = [];
            if (isFirstTime) {
                loadingPromises.push(this._loadTemplates(), this._loadVolumes());
            }

            this.editMode = !!this.object._isNew ? "edit" : "display";

            Promise.all(loadingPromises).then(function() {
                if (!self.object.config) {
                    self.object.config = {};
                }
                if (!!self.object._isNew) {
                    self.templateSetting = "none";
                    self.volumeSetting = "%";
                }
            });
        }
    },

    _loadTemplates: {
        value: function() {
            var self = this,
            templatesOptions = [];

            return this.application.virtualMachineService.getTemplates().then(function(templates) {
                self.templates = templates;
                for (var i = 0, length = templates.length; i < length; i++) {
                    templatesOptions.push({label: templates[i].template.name, value: templates[i].template.name});
                }
                templatesOptions.unshift({label:"---", value: "none"});
                self.templatesOptions = templatesOptions;
            });
        }
    },

    _loadVolumes: {
        value: function() {
            var self = this,
                volumeOptions = [];

            return this.application.dataService.fetchData(Model.Volume).then(function(volumes) {
                for (var i=0, length=volumes.length; i < length; i++) {
                    volumeOptions.push({label:volumes[i].id, value: volumes[i].id });
                }
                // FIXME: select-option-converter uses the string "none" as a
                // sigil for an empty value. Since "none" is also a valid volume
                // name, I'm replacing it with "%", which is not. This should be
                // fixed once select-option-converter is.
                volumeOptions.unshift({label:"---", value: "%"});
                self.volumeOptions = volumeOptions;
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
            this.object.config.ncpus = parseInt(this.cpuSetting);
            this.object.template = this.object.template === "none" ? null : this.object.template ;
            this.object.target = this.object.target === "%" ? null : this.object.target;
            this.application.dataService.saveDataObject(this.object);
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
