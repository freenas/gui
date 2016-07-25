var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    VmConfigBootloader = require("core/model/enumerations/vm-config-bootloader").VmConfigBootloader,
    VmDeviceType = require("core/model/enumerations/vm-device-type").VmDeviceType;

/**
 * @class VirtualMachineDevice
 * @extends Component
 */
exports.VirtualMachineDevice = Component.specialize({

    bootloaderOptions: {
        value: null
    },

    deviceTypes: {
        value: null
    },

    constructor: {
        value: function() {
            var deviceTypes = Array.from(VmDeviceType.members);
            deviceTypes.splice(deviceTypes.indexOf("VOLUME"), 1);
            this.deviceTypes = deviceTypes;

            this.bootloaderOptions = VmConfigBootloader.members;
        }
    },

    enterDocument: {
        value: function() {
            if (!this.object.type) {
                this.object.type = "DISK";
            }
        }
    },

    handleAddAction: {
        value: function() {

        }
    },

    handleRemoveAction: {
        value: function() {

        }
    }
});
