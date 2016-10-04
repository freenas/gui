var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VirtualMachineDeviceVolume = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this.volumeTypeOptions = this._sectionService.VOLUME_TYPES;;
        }
    }
});
