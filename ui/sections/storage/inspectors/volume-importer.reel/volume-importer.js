var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VolumeImporter = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            return this._listDetachedVolumes();
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            this._sectionService.getEncryptedVolumeImporterInstance().then(function(encryptedVolumeImporter) {
               self.encryptedVolumeImporter = encryptedVolumeImporter;
            });
        }
    },

    handleRefreshAction: {
        value: function() {
            return this._listDetachedVolumes();
        }
    },

    _listDetachedVolumes: {
        value: function() {
            var self = this;
            return this._sectionService.listDetachedVolumes().then(function(detachedVolumes) {
                self.detachedVolumes = detachedVolumes;
            });
        }
    }   
});
