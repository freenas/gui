const VmDeviceVolumeType = {
    VT9P: 'VT9P' as 'VT9P'
};
type VmDeviceVolumeType = (typeof VmDeviceVolumeType)[keyof typeof VmDeviceVolumeType];
export {VmDeviceVolumeType};
