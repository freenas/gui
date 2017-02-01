const ServiceFtpTlspolicy = {
    ON: 'ON' as 'ON',
    OFF: 'OFF' as 'OFF',
    DATA: 'DATA' as 'DATA',
    '!DATA': '!DATA' as '!DATA',
    AUTH: 'AUTH' as 'AUTH',
    CTRL: 'CTRL' as 'CTRL',
    'CTRL+DATA': 'CTRL+DATA' as 'CTRL+DATA',
    'CTRL+!DATA': 'CTRL+!DATA' as 'CTRL+!DATA',
    'AUTH+DATA': 'AUTH+DATA' as 'AUTH+DATA',
    'AUTH+!DATA': 'AUTH+!DATA' as 'AUTH+!DATA'
};
type ServiceFtpTlspolicy = (typeof ServiceFtpTlspolicy)[keyof typeof ServiceFtpTlspolicy];
export {ServiceFtpTlspolicy};
