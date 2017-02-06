const SnapshotInfoType = {
    FILESYSTEM: 'FILESYSTEM' as 'FILESYSTEM',
    VOLUME: 'VOLUME' as 'VOLUME'
};
type SnapshotInfoType = (typeof SnapshotInfoType)[keyof typeof SnapshotInfoType];
export {SnapshotInfoType};
