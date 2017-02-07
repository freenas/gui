const VmDatastoreNfsVersion = {
    NFSV3: 'NFSV3' as 'NFSV3',
    NFSV4: 'NFSV4' as 'NFSV4'
};
type VmDatastoreNfsVersion = (typeof VmDatastoreNfsVersion)[keyof typeof VmDatastoreNfsVersion];
export {VmDatastoreNfsVersion};
