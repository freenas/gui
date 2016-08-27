var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    VmDeviceNicDevice = require("core/model/enumerations/vm-device-nic-device").VmDeviceNicDevice,
    VmDeviceNicMode = require("core/model/enumerations/vm-device-nic-mode").VmDeviceNicMode;

/**
 * @class VirtualMachineDeviceNic
 * @extends Component
 */
exports.VirtualMachineDeviceNic = Component.specialize({
    interfaces: {
        value: null
    },

    nicDeviceOptions: {
        value: null
    },

    nicModeOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.nicDeviceOptions = VmDeviceNicDevice.members;
            this.nicModeOptions = VmDeviceNicMode.members;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            // FIXME: This should be updated every time the interfaces change.
            this.application.dataService.fetchData(Model.NetworkInterface).then(function(interfaces) {
                self.interfaces = interfaces.slice();
                self.interfaces.unshift({id: "default", enabled: true});
            });
        }
    }
});
