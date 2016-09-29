var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VirtualMachineDeviceUsb = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this.usbTypeOptions = this._sectionService.USB_DEVICES;
        }
    }
});
