const ServiceSshdSftploglevel = {
    QUIET: 'QUIET' as 'QUIET',
    FATAL: 'FATAL' as 'FATAL',
    ERROR: 'ERROR' as 'ERROR',
    INFO: 'INFO' as 'INFO',
    VERBOSE: 'VERBOSE' as 'VERBOSE',
    DEBUG: 'DEBUG' as 'DEBUG',
    DEBUG2: 'DEBUG2' as 'DEBUG2',
    DEBUG3: 'DEBUG3' as 'DEBUG3'
};
type ServiceSshdSftploglevel = (typeof ServiceSshdSftploglevel)[keyof typeof ServiceSshdSftploglevel];
export {ServiceSshdSftploglevel};
