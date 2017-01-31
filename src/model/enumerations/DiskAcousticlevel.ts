const DiskAcousticlevel = {
    DISABLED: 'DISABLED' as 'DISABLED',
    MINIMUM: 'MINIMUM' as 'MINIMUM',
    MEDIUM: 'MEDIUM' as 'MEDIUM',
    MAXIMUM: 'MAXIMUM' as 'MAXIMUM'
};
type DiskAcousticlevel = (typeof DiskAcousticlevel)[keyof typeof DiskAcousticlevel];
export {DiskAcousticlevel};
