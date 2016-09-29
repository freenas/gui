var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VirtualMachineDeviceGraphics = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this.graphicsResolutionOptions = this._sectionService.GRAPHICS_RESOLUTIONS;
        }
    }
});
