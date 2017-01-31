const VmStatusHealth = {
    HEALTHY: 'HEALTHY' as 'HEALTHY',
    DYING: 'DYING' as 'DYING',
    DEAD: 'DEAD' as 'DEAD',
    UNKNOWN: 'UNKNOWN' as 'UNKNOWN'
};
type VmStatusHealth = (typeof VmStatusHealth)[keyof typeof VmStatusHealth];
export {VmStatusHealth};
