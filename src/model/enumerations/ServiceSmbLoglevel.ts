const ServiceSmbLoglevel = {
    NONE: 'NONE' as 'NONE',
    MINIMUM: 'MINIMUM' as 'MINIMUM',
    NORMAL: 'NORMAL' as 'NORMAL',
    FULL: 'FULL' as 'FULL',
    DEBUG: 'DEBUG' as 'DEBUG'
};
type ServiceSmbLoglevel = (typeof ServiceSmbLoglevel)[keyof typeof ServiceSmbLoglevel];
export {ServiceSmbLoglevel};
