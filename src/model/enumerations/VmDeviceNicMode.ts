const VmDeviceNicMode = {
    BRIDGED: 'BRIDGED' as 'BRIDGED',
    NAT: 'NAT' as 'NAT',
    HOSTONLY: 'HOSTONLY' as 'HOSTONLY',
    MANAGEMENT: 'MANAGEMENT' as 'MANAGEMENT'
};
type VmDeviceNicMode = (typeof VmDeviceNicMode)[keyof typeof VmDeviceNicMode];
export {VmDeviceNicMode};
