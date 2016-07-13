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
            if (!!this._cpuSetting) {
                return this._cpuSetting;
            } else if (!!this.object.config && !!this.object.config.ncpus) {
                return this.object.config.ncpus;
            } else {
                return "";
            }
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
            if (!!this._memorySetting) {
                return this._memorySetting;
            } else if (!!this.object.config && !!this.object.config.memsize) {
                return this.object.config.memsize + "MB";
            } else {
                return "";
            }
        },

        set: function(memsize) {
            this._memorySetting = memsize;
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
            return !!this.object.target ? this.object.target : "none";
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._loadTemplates();
                this._loadVolumes();
            }
            this.editMode = !!this.object._isNew ? "edit" : "display";
            if (!this.object.config) {
                this.object.config = {};
            }
        }
    },

    _loadTemplates: {
        value: function() {
            var self = this,
            templatesOptions = [];

            this.application.virtualMachineService.getTemplates().then(function(templates) {
                self.templates = templates;
                for (var i = 0, length = templates.length; i < length; i++) {
                    templatesOptions.push({label: templates[i].template.name, value: templates[i].template.name});
                }
                templatesOptions.push({label:"---", value: "none"});
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
                volumeOptions.push({label:"---", value: "none"});
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
            this.application.dataService.saveDataObject(this.object);
        }
    }
});
