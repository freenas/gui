var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.EncryptedVolumeActions = AbstractInspector.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener("object.volume._providers_presence", this, "_handleProvidersPresenceChange");
            }
        }
    },

    handleLockButtonAction: {
        value: function(event) {
            this._sectionService.lockVolume(this.object.volume);
        }
    },

    handleUnlockButtonAction: {
        value: function(event) {
            var self = this;
            this._sectionService.unlockVolume(this.object.volume, this.object.unlockPassword).then(function() {
                self.object.unlockPassword = '';
            });
        }
    },

    handleRekeyButtonAction: {
        value: function(event) {
            var password = this.object.rekeyPassword && this.object.rekeyPassword.length > 0 ? this.object.rekeyPassword : null;
            this._sectionService.rekeyVolume(this.object.volume, this.object.rekeyKey, password);
        }
    },

    handleBackupKeyAction: {
        value: function() {
            var self = this;
            this._sectionService.getVolumeKey(this.object.volume).then(function(response) {
                var downloadLink = document.createElement("a");
                    downloadLink.href = response.link;
                    downloadLink.download = "key_" + self.object.volume.id + ".key";
                    downloadLink.click();
                response.taskPromise.then(function(password) {
                    self.object.backupKeyPassword = password;
                });
            });
        }
    },

    handleRestoreKeyAction: {
        value: function() {
            var password = this.object.restoreKeyPassword && this.object.restoreKeyPassword.length > 0 ? this.object.restoreKeyPassword : null;
            this._sectionService.setVolumeKey(this.object.volume, this.object.keyFile, password);
        }
    },

    _handleProvidersPresenceChange: {
        value: function(value) {
            this.providers = value;
        }
    }
});
