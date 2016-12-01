var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.EncryptedVolumeImporter = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            return this._sectionService.listDisks().then(function(disks) {
                return self.disks = disks;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addRangeAtPathChangeListener("object.disks", this, "_handleDisksChange");
            }
            this._sectionService.clearReservedDisks();
        }
    },

    save: {
        value: function() {
            this._sectionService.importEncryptedVolume(this.object);
        }
    },

    shouldAcceptComponentInDiskCategory: {
        value: function(component, diskCategory) {
            return component.object &&
                    diskCategory.disks.indexOf(component.object) === -1 &&
                    component.object.status &&
                    component.object.status.is_ssd === diskCategory.isSsd;
        }
    },

    handleComponentDropInDiskCategory: {
        value: function(component, diskCategory) {
            var disk = component.object,
                diskIndex = this.object.disks.indexOf(disk);
            if (diskIndex !== -1) {
                this.object.disks.splice(diskIndex, 1);
            }
        }
    },

    handleImportVolumeAction: {
        value: function () {
            this._sectionService.importEncryptedVolume(this.object);
        }
    },

    _handleDisksChange: {
        value: function(addedDisks, removedDisks) {
            var i, length;
            for (i = 0, length = addedDisks.length; i < length; i++) {
                this._sectionService.markDiskAsReserved(addedDisks[i]);
            }
            for (i = 0, length = removedDisks.length; i < length; i++) {
                this._sectionService.markDiskAsNonReserved(removedDisks[i]);
            }
        }
    }
});
