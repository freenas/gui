const VmDeviceDiskMode = {
    AHCI: 'AHCI' as 'AHCI',
    VIRTIO: 'VIRTIO' as 'VIRTIO'
};
type VmDeviceDiskMode = (typeof VmDeviceDiskMode)[keyof typeof VmDeviceDiskMode];
export {VmDeviceDiskMode};
