var Component = require("montage/ui/component").Component,
    VmDeviceDiskMode = require("core/model/enumerations/vm-device-disk-mode").VmDeviceDiskMode;

/**
 * @class VirtualMachineDeviceDisk
 * @extends Component
 */
exports.VirtualMachineDeviceDisk = Component.specialize({

    diskModeOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.diskModeOptions = VmDeviceDiskMode.members;
        }
    }
});
