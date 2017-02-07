var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Promise = require("montage/core/promise").Promise,
    _ = require("lodash");

exports.Preferences = AbstractInspector.specialize({

    handleDownloadConfigAction: {
        value: function () {
            Promise.all([
                this._sectionService.getSystemVersion(),
                this.application.systemService.getConfigFileAddress()
            ]).spread(function(systemVersion, taskReponse) {
                var downloadLink = document.createElement("a");
                downloadLink.href = taskReponse.link;
                downloadLink.download = "FreeNAS10-" +
                    systemVersion.split("-")[3] + "-" +
                    (new Date()).toISOString().split('T')[0] +
                    "-database.db";
                downloadLink.click();
            });
        }
    },

    handleApplyConfigAction: {
        value: function () {
            this.application.systemService.restoreDatabase(this.configFile);
        }
    },

    handleFactoryRestoreAction: {
        value: function () {
            this.application.systemService.restoreFactorySettings();
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
                    this._sectionService.getSystemAdvanced().then(function(advanced) {
                        self.systemAdvancedData = advanced;
                    }),
                    this._sectionService.getSystemGeneral().then(function(systemGeneral) {
                        self.systemGeneralData = systemGeneral;
                    }),
                    this.application.systemService.getBootPoolConfig().then(function(bootPool){
                        self.datasetOptions.push({label:"Boot Pool", value:bootPool["id"]});
                    }),
                    this._sectionService.getSystemDataset().then(function(systemDataset) {
                        self.systemDatasetData = systemDataset.pool;
                    }),
                    this._sectionService.listVolumes().then(function(volumesList) {
                        for (var i = 0; i < volumesList.length; i++) {
                            self.datasetOptions.push({label:volumesList[i]["id"], value:volumesList[i]["id"]});
                        }
                    })
                );
                Promise.all(loadingPromises).then(function() {
                    self._snapshotDataObjectsIfNecessary()
                    self.isLoading = false;
                });
            }
        }
    },

    save: {
        value: function() {
            return Promise.all([
                this.application.systemService.saveGeneral(this.systemGeneralData),
                this.application.systemService.saveAdvanced(this.systemAdvancedData),
                this.application.systemService.changeBootPool(this.systemDatasetData)
            ]);
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
                this._systemGeneralData = _.cloneDeep(this.systemGeneralData);
            }
            if (!this._systemAdvancedData) {
                this._systemAdvancedData = _.cloneDeep(this.systemAdvancedData);
            }
            if (!this._systemDatasetData) {
                this._systemDatasetData = _.cloneDeep(this.systemDatasetData);
            }
        }
    }
});
