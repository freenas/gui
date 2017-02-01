const EnclosureElementStatus = {
    UNSUPPORTED: 'UNSUPPORTED' as 'UNSUPPORTED',
    OK: 'OK' as 'OK',
    CRIT: 'CRIT' as 'CRIT',
    NONCRIT: 'NONCRIT' as 'NONCRIT',
    UNRECOV: 'UNRECOV' as 'UNRECOV',
    NOTINSTALLED: 'NOTINSTALLED' as 'NOTINSTALLED',
    UNKNOWN: 'UNKNOWN' as 'UNKNOWN',
    NOTAVAIL: 'NOTAVAIL' as 'NOTAVAIL',
    NOACCESS: 'NOACCESS' as 'NOACCESS'
};
type EnclosureElementStatus = (typeof EnclosureElementStatus)[keyof typeof EnclosureElementStatus];
export {EnclosureElementStatus};
