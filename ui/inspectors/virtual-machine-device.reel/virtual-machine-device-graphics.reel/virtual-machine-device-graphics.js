var Component = require("montage/ui/component").Component,
    VmDeviceGraphicsResolution = require("core/model/enumerations/vm-device-graphics-resolution").VmDeviceGraphicsResolution;

/**
 * @class VirtualMachineDeviceGraphics
 * @extends Component
 */
exports.VirtualMachineDeviceGraphics = Component.specialize({
    graphicsResolutionOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.graphicsResolutionOptions = VmDeviceGraphicsResolution.members;
        }
    }
});
