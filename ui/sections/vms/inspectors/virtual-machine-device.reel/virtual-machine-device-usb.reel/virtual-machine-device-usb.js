var Component = require("montage/ui/component").Component,
    VmsSectionService = require("core/service/section/vms-section-service").VmsSectionService;

exports.VirtualMachineDeviceUsb = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._sectionService = VmsSectionService.instance;
            this.usbTypeOptions = this._sectionService.USB_DEVICES;
        }
    }
});
