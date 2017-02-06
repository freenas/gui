const ZfsPoolStatus = {
    ONLINE: 'ONLINE' as 'ONLINE',
    OFFLINE: 'OFFLINE' as 'OFFLINE',
    DEGRADED: 'DEGRADED' as 'DEGRADED',
    FAULTED: 'FAULTED' as 'FAULTED',
    REMOVED: 'REMOVED' as 'REMOVED',
    UNAVAIL: 'UNAVAIL' as 'UNAVAIL'
};
type ZfsPoolStatus = (typeof ZfsPoolStatus)[keyof typeof ZfsPoolStatus];
export {ZfsPoolStatus};
