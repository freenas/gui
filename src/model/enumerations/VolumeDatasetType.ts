const VolumeDatasetType = {
    FILESYSTEM: 'FILESYSTEM' as 'FILESYSTEM',
    VOLUME: 'VOLUME' as 'VOLUME'
};
type VolumeDatasetType = (typeof VolumeDatasetType)[keyof typeof VolumeDatasetType];
export {VolumeDatasetType};
