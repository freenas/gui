const ServiceSshdSftplogfacility = {
    DAEMON: 'DAEMON' as 'DAEMON',
    USER: 'USER' as 'USER',
    AUTH: 'AUTH' as 'AUTH',
    LOCAL0: 'LOCAL0' as 'LOCAL0',
    LOCAL1: 'LOCAL1' as 'LOCAL1',
    LOCAL2: 'LOCAL2' as 'LOCAL2',
    LOCAL3: 'LOCAL3' as 'LOCAL3',
    LOCAL4: 'LOCAL4' as 'LOCAL4',
    LOCAL5: 'LOCAL5' as 'LOCAL5',
    LOCAL6: 'LOCAL6' as 'LOCAL6',
    LOCAL7: 'LOCAL7' as 'LOCAL7'
};
type ServiceSshdSftplogfacility = (typeof ServiceSshdSftplogfacility)[keyof typeof ServiceSshdSftplogfacility];
export {ServiceSshdSftplogfacility};
