/**
 * @module ui/debug.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Debug
 * @extends Component
 */
exports.Debug = Component.specialize(/** @lends Debug# */ {
    consoleData: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this.isLoading = true;
                this.application.systemAdvancedService.getSystemAdvanced().then(function(consoleData) {
                    self.object = consoleData;
                    self._snapshotDataObjectsIfNecessary();
                });
            }
        }
    },

    save: {
        value: function() {
            return this.application.systemAdvancedService.saveAdvanceData(this.object);
        }
    },

    handleDownloadDebugAction: {
        value: function() {
            var self = this;
            var todayString = new Date();
            var todayString = todayString.toISOString().split('T')[0];
            this.application.systemInfoService.getVersion().then(function(systemVersion) {
                self.systemVersion = systemVersion.split("-")[3];

            });
            this.application.systemAdvancedService.getDebugCollectAddress().then(function(debugObject) {
                var downloadLink = document.createElement("a");
                    downloadLink.href = debugObject[1][0];
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
                this._object = this.application.dataService.clone(this.object);
            }
        }
    }
});
