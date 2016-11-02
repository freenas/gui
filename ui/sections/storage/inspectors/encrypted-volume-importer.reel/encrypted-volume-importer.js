var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.EncryptedVolumeImporter = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            return this._sectionService.listAvailableDisks().then(function(availableDisks) {
                self.availableDisks = availableDisks; 
            });
        }
    },

    save: {
        value: function() {
            this._sectionService.importEncryptedVolume(this.object);
        }
    }
});
