const VmwareDatasetFilterOp = {
    NONE: 'NONE' as 'NONE',
    INCLUDE: 'INCLUDE' as 'INCLUDE',
    EXCLUDE: 'EXCLUDE' as 'EXCLUDE'
};
type VmwareDatasetFilterOp = (typeof VmwareDatasetFilterOp)[keyof typeof VmwareDatasetFilterOp];
export {VmwareDatasetFilterOp};
