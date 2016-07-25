var Component = require("montage/ui/component").Component,
    VmDeviceVolumeType = require("core/model/enumerations/vm-device-volume-type").VmDeviceVolumeType;

/**
 * @class VirtualMachineDeviceVolume
 * @extends Component
 */
exports.VirtualMachineDeviceVolume = Component.specialize({
    volumeTypeOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.volumeTypeOptions = VmDeviceVolumeType.members;
        }
    }
});
