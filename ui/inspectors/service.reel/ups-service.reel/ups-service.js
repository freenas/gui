var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    ServiceUpsShutdownmode = require("core/model/enumerations/ServiceUpsShutdownmode").ServiceUpsShutdownmode,
    ServiceUpsMode = require("core/model/enumerations/ServiceUpsMode").ServiceUpsMode,
    Units = require('core/Units');

exports.UpsService = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this.timerUnits = Units.SECONDS;
            this.modeOptions = this.cleanupEnumeration(ServiceUpsMode).map(function (x) {
                return {
                    label: x,
                    value: x
                };
            });
            this.shutdownModeOptions = this.cleanupEnumeration(ServiceUpsShutdownmode).map(function (x) {
                return {
                    label: x,
                    value: x
                };
            });
            return Promise.all([
                this.application.powerManagementService.listDrivers(),
                this.application.powerManagementService.listUsbDevices()
            ]).spread(function(drivers, usbDevices) {
                self.driverOptions = drivers.map(function(x) {
                    return {
                        label: x.description,
                        value: x.driver_name
                    };
                });
                self.driverPortOptions = usbDevices.map(function(x) {
                    return {
                        label: x.device + ' - ' + x.description,
                        value: x.device
                    };
                });
            });
        }
    }
});
