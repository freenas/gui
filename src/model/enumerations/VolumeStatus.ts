const VolumeStatus = {
    UNAVAIL: 'UNAVAIL' as 'UNAVAIL',
    UNKNOWN: 'UNKNOWN' as 'UNKNOWN',
    LOCKED: 'LOCKED' as 'LOCKED',
    ONLINE: 'ONLINE' as 'ONLINE'
};
type VolumeStatus = (typeof VolumeStatus)[keyof typeof VolumeStatus];
export {VolumeStatus};
