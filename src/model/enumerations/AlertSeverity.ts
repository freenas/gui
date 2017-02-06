const AlertSeverity = {
    CRITICAL: 'CRITICAL' as 'CRITICAL',
    WARNING: 'WARNING' as 'WARNING',
    INFO: 'INFO' as 'INFO'
};
type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];
export {AlertSeverity};
