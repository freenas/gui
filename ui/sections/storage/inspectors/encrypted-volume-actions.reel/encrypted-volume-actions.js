var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    Volume = require('core/model/Volume').Volume;

exports.EncryptedVolumeActions = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.providers = this.object.volume.providers_presence;
            this.volumeChangedListener = this._eventDispatcherService.addEventListener(Volume.getEventNames().change(this.object.volume.id), this.handleVolumeChanged.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(Volume.getEventNames().change(this.object.volume.id), this.volumeChangedListener);
        }
    },

    handleVolumeChanged: {
        value: function(state) {
            this.providers = state.get('providers_presence');
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
            this._sectionService.rekeyVolume(this.object.volume, this.object.rekeyKey, this.object.rekeyPassword);
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
            var password = this.object.restoreKeyPassword && this.object.restoreKeyPassword.$password && this.object.restoreKeyPassword.$password.length > 0 ? this.object.restoreKeyPassword : null;
            this._sectionService.setVolumeKey(this.object.volume, this.object.keyFile, password);
        }
    }
});
