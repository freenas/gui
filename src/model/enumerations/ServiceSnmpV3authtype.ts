const ServiceSnmpV3authtype = {
    MD5: 'MD5' as 'MD5',
    SHA: 'SHA' as 'SHA'
};
type ServiceSnmpV3authtype = (typeof ServiceSnmpV3authtype)[keyof typeof ServiceSnmpV3authtype];
export {ServiceSnmpV3authtype};
