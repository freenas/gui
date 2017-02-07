const ZfsVdevType = {
    disk: 'disk' as 'disk',
    file: 'file' as 'file',
    mirror: 'mirror' as 'mirror',
    raidz1: 'raidz1' as 'raidz1',
    raidz2: 'raidz2' as 'raidz2',
    raidz3: 'raidz3' as 'raidz3'
};
type ZfsVdevType = (typeof ZfsVdevType)[keyof typeof ZfsVdevType];
export {ZfsVdevType};
