var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    VmsSectionService = require("core/service/section/vms-section-service").VmsSectionService;

/**
 * @class VirtualMachineDeviceNic
 * @extends Component
 */
exports.VirtualMachineDeviceNic = Component.specialize({
    templateDidLoad: {
        value: function() {
            var self = this;
            this._sectionService = VmsSectionService.instance;
            this.nicDeviceOptions = this._sectionService.NIC_DEVICES;
            this.nicModeOptions = this._sectionService.NIC_MODES;
            this._sectionService.listNetworkInterfaces().then(function(interfaces) {
                self.interfaces = interfaces;
            });
        }
    }
});
