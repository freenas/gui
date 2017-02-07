const VolumePropertyhealthValue = {
    ONLINE: 'ONLINE' as 'ONLINE',
    DEGRADED: 'DEGRADED' as 'DEGRADED',
    FAULTED: 'FAULTED' as 'FAULTED',
    OFFLINE: 'OFFLINE' as 'OFFLINE',
    REMOVED: 'REMOVED' as 'REMOVED',
    UNAVAIL: 'UNAVAIL' as 'UNAVAIL',
    LOCKED: 'LOCKED' as 'LOCKED'
};
type VolumePropertyhealthValue = (typeof VolumePropertyhealthValue)[keyof typeof VolumePropertyhealthValue];
export {VolumePropertyhealthValue};
