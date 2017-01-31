const BackupCompressionType = {
    NONE: 'NONE' as 'NONE',
    GZIP: 'GZIP' as 'GZIP'
};
type BackupCompressionType = (typeof BackupCompressionType)[keyof typeof BackupCompressionType];
export {BackupCompressionType};
