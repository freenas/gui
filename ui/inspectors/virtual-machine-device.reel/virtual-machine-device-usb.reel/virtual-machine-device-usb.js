var Component = require("montage/ui/component").Component,
    VmDeviceUsbDevice = require("core/model/enumerations/vm-device-usb-device").VmDeviceUsbDevice;

/**
 * @class VirtualMachineDeviceUsb
 * @extends Component
 */
exports.VirtualMachineDeviceUsb = Component.specialize({
    usbDeviceOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.usbDeviceOptions = VmDeviceUsbDevice.members;
        }
    }
});
