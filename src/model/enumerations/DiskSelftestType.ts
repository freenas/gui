const DiskSelftestType = {
    SHORT: 'SHORT' as 'SHORT',
    LONG: 'LONG' as 'LONG',
    CONVEYANCE: 'CONVEYANCE' as 'CONVEYANCE',
    OFFLINE: 'OFFLINE' as 'OFFLINE'
};
type DiskSelftestType = (typeof DiskSelftestType)[keyof typeof DiskSelftestType];
export {DiskSelftestType};
