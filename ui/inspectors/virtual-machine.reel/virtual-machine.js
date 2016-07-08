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
    }
});
