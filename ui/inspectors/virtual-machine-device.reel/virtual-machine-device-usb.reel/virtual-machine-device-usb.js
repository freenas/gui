var Component = require("montage/ui/component").Component,
    VmDeviceUsbDevice = require("core/model/enumerations/vm-device-usb-device").VmDeviceUsbDevice;

/**
 * @class VirtualMachineDeviceUsb
 * @extends Component
 */
exports.VirtualMachineDeviceUsb = Component.specialize({
    usbTypeOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.usbTypeOptions = VmDeviceUsbDevice.members;
        }
    },

    enterDocument: {
        value: function() {
            if (!this.object.device) {
                this.object.device = "tablet";
            }
        }
    }
});
