var Component = require("montage/ui/component").Component,
    VmsSectionService = require("core/service/section/vms-section-service").VmsSectionService;

/**
 * @class VirtualMachineDeviceDisk
 * @extends Component
 */
exports.VirtualMachineDeviceDisk = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._sectionService = VmsSectionService.instance;
            this.diskModeOptions = this._sectionService.DISK_MODES;
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            this.object._diskSize = this._sectionService.convertDiskSizeToString(this.object.size);
            if (isFirsttime) {
                this.addPathChangeListener("object._diskSize", this, "_handleDiskSizeChange");
            }
        }
    },

    _handleDiskSizeChange: {
        value: function() {
            this.object.size = this._sectionService.convertDiskSizeStringToSize(this.object._diskSize);
        }
    }
});
