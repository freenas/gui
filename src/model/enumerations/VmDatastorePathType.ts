const VmDatastorePathType = {
    BLOCK_DEVICE: 'BLOCK_DEVICE' as 'BLOCK_DEVICE',
    DIRECTORY: 'DIRECTORY' as 'DIRECTORY',
    FILE: 'FILE' as 'FILE',
    SNAPSHOT: 'SNAPSHOT' as 'SNAPSHOT'
};
type VmDatastorePathType = (typeof VmDatastorePathType)[keyof typeof VmDatastorePathType];
export {VmDatastorePathType};
