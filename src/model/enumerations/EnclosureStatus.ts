const EnclosureStatus = {
    UNRECOV: 'UNRECOV' as 'UNRECOV',
    CRITICAL: 'CRITICAL' as 'CRITICAL',
    NONCRITICAL: 'NONCRITICAL' as 'NONCRITICAL',
    INFO: 'INFO' as 'INFO',
    INVOP: 'INVOP' as 'INVOP',
    OK: 'OK' as 'OK'
};
type EnclosureStatus = (typeof EnclosureStatus)[keyof typeof EnclosureStatus];
export {EnclosureStatus};
