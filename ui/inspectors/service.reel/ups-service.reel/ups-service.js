var Component = require("montage/ui/component").Component,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model,
    ServiceUpsShutdownmode = require("core/model/enumerations/service-ups-shutdownmode").ServiceUpsShutdownmode,
    ServiceUpsMode = require("core/model/enumerations/service-ups-mode").ServiceUpsMode;
/**
 * @class UpsService
 * @extends Component
 */
exports.UpsService = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            var self = this,
                loadingPromises = [];
            if(isFirstTime) {
                this.isLoading = true;
                this.driverOptions = [];
                this.driverPortOptions = [];
                this.modeOptions = ServiceUpsMode.members.map(function (x) {
                    return {
                        label: x,
                        value: x
                    };
                });
                this.shutdownModeOptions = ServiceUpsShutdownmode.members.map(function (x) {
                    return {
                        label: x,
                        value: x
                    };
                })
                loadingPromises.push(
                    this.application.powerManagementService.listDrivers().then(function (drivers) {
                        for (var i = 0; i < drivers.length; i++) {
                            self.driverOptions.push({label: drivers[i][1], value: drivers[i][0]});
                        }
                    }),
                    this.application.powerManagementService.listUsbDevices().then(function (usbDevices) {
                        for (var i = 0; i < usbDevices.length; i++) {
                            self.driverPortOptions.push({label: usbDevices[i][1], value: usbDevices[i][0]});
                        }
                    })
                );
            }
        }
    }
});;
