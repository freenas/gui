var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Settings = AbstractInspector.specialize({
    additional_templates: {
        value: []
    },

    enterDocument: {
        value: function() {
            this.additional_templates = this.object.settings.config.additional_templates.map(function(x) {
                return x.url;
            });
        }
    },

    save: {
        value: function() {
            var templates = [];
            for (var i = 0; i < this.additional_templates.length; i++) {
                templates.push({
                    id: this.additional_templates[i].replace(/\//g, '-'),
                    url: this.additional_templates[i],
                    driver: 'git'
                });
            }
            this.object.settings.config.additional_templates = templates;
            this._sectionService.saveSettings(this.object.settings);
        }
    },

    revert: {
        value: function() {
            this.additional_templates = this.object.settings.config.additional_templates.map(function(x) {
                return x.url;
            });
            this._sectionService.revertSettings();
        }
    },

    handleFlushTemplateCacheAction: {
        value: function() {
            this._sectionService.flushTemplateCache();
        }
    }
});
