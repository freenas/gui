/**
 * @module ui/system.reel
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class System
 * @extends Component
 */
exports.System = Component.specialize(/** @lends System# */ {

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
                    this.application.systemAdvancedService.getSerialConsoleData().then(function(consoleData) {
                        self.consoleData = consoleData;
                        self.systemAdvancedData = consoleData.systemAdvanced;
                    }),
                    this.application.dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral) {
                        self.systemGeneralData = systemGeneral[0];
                    }),
                    this.application.systemDatasetService.getBootpoolConfig().then(function(bootPool){
                        self.datasetOptions.push({label:"Boot Pool", value:bootPool["id"]});
                    }),
                    this.application.storageService.listVolumes().then(function(volumesList) {
                        console.log(volumesList);
                        for (var i = 0; i < volumesList.length; i++) {
                            self.datasetOptions.push({label:volumesList[i]["id"], value:volumesList[i]["id"]});
                        }
                    })
                );
                Promise.all(loadingPromises).then(function() {
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
                this.application.dataService.saveDataObject(this.systemAdvancedData)
            );
            return Promise.all(savingPromises);
        }
    }
});
