const VolumeProvidersPresence = {
    ALL: 'ALL' as 'ALL',
    PART: 'PART' as 'PART',
    NONE: 'NONE' as 'NONE'
};
type VolumeProvidersPresence = (typeof VolumeProvidersPresence)[keyof typeof VolumeProvidersPresence];
export {VolumeProvidersPresence};
