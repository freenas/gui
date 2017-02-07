const VmDeviceNicDevice = {
    VIRTIO: 'VIRTIO' as 'VIRTIO',
    E1000: 'E1000' as 'E1000',
    NE2K: 'NE2K' as 'NE2K'
};
type VmDeviceNicDevice = (typeof VmDeviceNicDevice)[keyof typeof VmDeviceNicDevice];
export {VmDeviceNicDevice};
