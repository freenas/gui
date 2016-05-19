/**
 * @module ui/general.reel
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class General
 * @extends Component
 */
exports.General = Component.specialize(/** @lends General# */ {
    systemGeneral: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.isLoading = true;
            }
            var self = this,
                loadingPromises = [];
            loadingPromises.push(
                this.application.dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral) {
                    self.systemGeneral = systemGeneral[0];
                }),
                this.application.systemInfoService.getVersion().then(function(version) {
                    self.version = version;
                }),
                this.application.systemInfoService.getHardware().then(function(hardware) {
                    self.hardware = hardware;
                }),
                this.application.systemInfoService.getTime().then(function(time) {
                    self.time = time;
                }),
                this.application.systemInfoService.getLoad().then(function(load) {
                    self.load = load;
                })
            );
            Promise.all(loadingPromises).then(function() {
                self.isLoading = false;
            });
        }
    },

    handleRebootAction: {
       value: function() {
           this.application.systemService.reboot();
       }
    },

    handleShutdownAction: {
       value: function() {
           this.application.systemService.shutdown();
       }
    }
});
