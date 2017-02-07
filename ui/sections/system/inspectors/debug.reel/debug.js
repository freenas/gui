var Component = require("montage/ui/component").Component,
    _ = require("lodash");

exports.Debug = Component.specialize({
    consoleData: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this.isLoading = true;
                this.application.systemService.getAdvanced().then(function(consoleData) {
                    self.object = consoleData;
                    self._snapshotDataObjectsIfNecessary();
                });
            }
        }
    },

    save: {
        value: function() {
            return this.application.systemService.saveAdvanced(this.object);
        }
    },

    handleDownloadDebugAction: {
        value: function() {
            var self = this;
            var todayString = (new Date()).toISOString().split('T')[0];
            this.application.systemService.getVersion().then(function(systemVersion) {
                self.systemVersion = systemVersion.split("-")[3];
            });
            this.application.systemService.getDebugFileAddress().then(function(debugObject) {
                var downloadLink = document.createElement("a");
                    downloadLink.href = debugObject.link;
                    downloadLink.download = "FreeNAS10" + "-" + self.systemVersion + "-" + todayString + "-" + "debug.tar.gz";
                    downloadLink.click();
            });
        }
    },

    revert: {
        value: function() {
            this.object.debugkernel = this._object.debugkernel;
            this.object.uploadcrash = this._object.uploadcrash;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._object) {
                this._object = _.cloneDeep(this.object);
            }
        }
    }
});
