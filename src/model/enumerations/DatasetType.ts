const DatasetType = {
    FILESYSTEM: 'FILESYSTEM' as 'FILESYSTEM',
    VOLUME: 'VOLUME' as 'VOLUME',
    SNAPSHOT: 'SNAPSHOT' as 'SNAPSHOT',
    BOOKMARK: 'BOOKMARK' as 'BOOKMARK'
};
type DatasetType = (typeof DatasetType)[keyof typeof DatasetType];
export {DatasetType};
