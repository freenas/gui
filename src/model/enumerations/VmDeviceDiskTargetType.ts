const VmDeviceDiskTargetType = {
    ZVOL: 'ZVOL' as 'ZVOL',
    FILE: 'FILE' as 'FILE',
    DISK: 'DISK' as 'DISK'
};
type VmDeviceDiskTargetType = (typeof VmDeviceDiskTargetType)[keyof typeof VmDeviceDiskTargetType];
export {VmDeviceDiskTargetType};
