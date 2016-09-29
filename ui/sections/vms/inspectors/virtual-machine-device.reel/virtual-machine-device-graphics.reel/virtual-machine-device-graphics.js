var Component = require("montage/ui/component").Component,
    VmsSectionService = require("core/service/section/vms-section-service").VmsSectionService;

/**
 * @class VirtualMachineDeviceGraphics
 * @extends Component
 */
exports.VirtualMachineDeviceGraphics = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._sectionService = VmsSectionService.instance;
            this.graphicsResolutionOptions = this._sectionService.GRAPHICS_RESOLUTIONS;
        }
    }
});
