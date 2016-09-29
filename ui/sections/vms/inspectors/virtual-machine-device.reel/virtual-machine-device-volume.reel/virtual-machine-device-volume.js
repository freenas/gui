var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    VmsSectionService = require("core/service/section/vms-section-service").VmsSectionService;

exports.VirtualMachineDeviceVolume = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this._sectionService = VmsSectionService.instance;
            this.volumeTypeOptions = this._sectionService.VOLUME_TYPES;;
        }
    }
});
