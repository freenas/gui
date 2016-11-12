/**
 * @module ui/system.reel
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Preferences
 * @extends Component
 */
exports.Preferences = Component.specialize(/** @lends Preferences# */ {

    handleDownloadConfigAction: {
        value: function () {
            var self = this;
            var todayString = new Date();
            var todayString = todayString.toISOString().split('T')[0];
            this.application.systemInfoService.getVersion().then(function(systemVersion) {
                self.systemVersion = systemVersion.split("-")[3];
            });
            this.application.systemAdvancedService.getConfigFileAddress().then(function(databaseDump) {
                var downloadLink = document.createElement("a");
                    downloadLink.href = databaseDump[1][0];
                    downloadLink.download = "FreeNAS10" + "-" + self.systemVersion + "-" + todayString + "-" + "database.db";
                    downloadLink.click();
            })
        }
    },

    handleSaveConfigAction: {
        value: function () {
            var self = this;
                this.application.systemAdvancedService.restoreSettingsFromFileUpload(this.configFile).then(function () {
            });
        }
    },

    handleFactoryRestoreAction: {
        value: function () {
                this.application.systemAdvancedService.restoreFactorySettings().then(function () {
            });
        }
    },

    systemGeneralData: {
        value: null
    },

    systemAdvancedData: {
        value: null
    },

    systemDatasetData: {
        value: null
    },

    consoleData: {
        value: null
    },

    datasetOptions: {
        value: []
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                loadingPromises = [];
            if(isFirstTime) {
                this.isLoading = true;
                loadingPromises.push(
                    this.application.systemAdvancedService.getSystemAdvanced().then(function(consoleData) {
                        self.systemAdvancedData = consoleData;
                    }),
                    this.application.dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral) {
                        self.systemGeneralData = systemGeneral[0];
                    }),
                    this.application.systemDatasetService.getBootpoolConfig().then(function(bootPool){
                        self.datasetOptions.push({label:"Boot Pool", value:bootPool["id"]});
                    }),
                    this.application.systemDatasetService.getSystemDatasetPool().then(function(systemDatasetPool) {
                        self.systemDatasetData = systemDatasetPool.pool;
                    }),
                    this.application.storageService.listVolumes().then(function(volumesList) {
                        for (var i = 0; i < volumesList.length; i++) {
                            self.datasetOptions.push({label:volumesList[i]["id"], value:volumesList[i]["id"]});
                        }
                    })
                );
                Promise.all(loadingPromises).then(function() {
                    self._snapshotDataObjectsIfNecessary()
                    this.isLoading = false;
                });
            }
        }
    },

    save: {
        value: function() {
            var savingPromises = [];
            savingPromises.push(
                this.application.dataService.saveDataObject(this.systemGeneralData),
                this.application.dataService.saveDataObject(this.systemAdvancedData),
                this.application.systemService.changeBootPool(this.systemDatasetData)
            );
            return Promise.all(savingPromises);
        }
    },

    revert: {
        value: function() {
            this.systemGeneralData.hostname = this._systemGeneralData.hostname;
            this.systemGeneralData.syslog_server = this._systemGeneralData.syslog_server;
            this.systemAdvancedData.powerd = this._systemAdvancedData.powerd;
            this.systemAdvancedData.uploadcrash = this._systemAdvancedData.uploadcrash;
            this.systemAdvancedData.motd = this._systemAdvancedData.motd;
            this.systemDatasetData = this._systemDatasetData;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._systemGeneralData) {
                this._systemGeneralData = this.application.dataService.clone(this.systemGeneralData);
            }
            if (!this._systemAdvancedData) {
                this._systemAdvancedData = this.application.dataService.clone(this.systemAdvancedData);
            }
            if (!this._systemDatasetData) {
                this._systemDatasetData = this.application.dataService.clone(this.systemDatasetData);
            }
        }
    }
});
