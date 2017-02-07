const VmDeviceType = {
    DISK: 'DISK' as 'DISK',
    CDROM: 'CDROM' as 'CDROM',
    NIC: 'NIC' as 'NIC',
    VOLUME: 'VOLUME' as 'VOLUME',
    GRAPHICS: 'GRAPHICS' as 'GRAPHICS',
    USB: 'USB' as 'USB'
};
type VmDeviceType = (typeof VmDeviceType)[keyof typeof VmDeviceType];
export {VmDeviceType};
