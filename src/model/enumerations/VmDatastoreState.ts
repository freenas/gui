const VmDatastoreState = {
    ONLINE: 'ONLINE' as 'ONLINE',
    OFFLINE: 'OFFLINE' as 'OFFLINE'
};
type VmDatastoreState = (typeof VmDatastoreState)[keyof typeof VmDatastoreState];
export {VmDatastoreState};
