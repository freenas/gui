var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VolumeMediaImporter = AbstractInspector.specialize({

    handleRefreshMediaAction: {
        value: function() {
            return this._listImportableDisks();
        }
    },

    _listImportableDisks: {
        value: function() {
            var self = this;
            return this._sectionService.listImportableDisks().then(function(importableDisks) {
                self.importableDiskOptions = importableDisks.map(function(x) {
                    var label = x.label;
                    if (label === null) {
                        label = x.path.replace(/\/dev\//, '');
                    }
                    return { label: label, value: x.path };
                });
            });
        }
    },
    handleImportMediaAction: {
        value: function() {
            return this._sectionService.importDisk(this.importDisk, this.importPath, this.importFsType);
        }
    }
});
