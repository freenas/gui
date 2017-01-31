const DiskEraseMethod = {
    QUICK: 'QUICK' as 'QUICK',
    ZEROS: 'ZEROS' as 'ZEROS',
    RANDOM: 'RANDOM' as 'RANDOM'
};
type DiskEraseMethod = (typeof DiskEraseMethod)[keyof typeof DiskEraseMethod];
export {DiskEraseMethod};
