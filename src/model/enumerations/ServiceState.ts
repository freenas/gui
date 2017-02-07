const ServiceState = {
    RUNNING: 'RUNNING' as 'RUNNING',
    STARTING: 'STARTING' as 'STARTING',
    STOPPING: 'STOPPING' as 'STOPPING',
    STOPPED: 'STOPPED' as 'STOPPED',
    ERROR: 'ERROR' as 'ERROR',
    UNKNOWN: 'UNKNOWN' as 'UNKNOWN'
};
type ServiceState = (typeof ServiceState)[keyof typeof ServiceState];
export {ServiceState};
