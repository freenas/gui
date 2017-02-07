const DisksAllocationType = {
    BOOT: 'BOOT' as 'BOOT',
    VOLUME: 'VOLUME' as 'VOLUME',
    EXPORTED_VOLUME: 'EXPORTED_VOLUME' as 'EXPORTED_VOLUME',
    ISCSI: 'ISCSI' as 'ISCSI'
};
type DisksAllocationType = (typeof DisksAllocationType)[keyof typeof DisksAllocationType];
export {DisksAllocationType};
