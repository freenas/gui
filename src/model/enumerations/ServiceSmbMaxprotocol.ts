const ServiceSmbMaxprotocol = {
    CORE: 'CORE' as 'CORE',
    COREPLUS: 'COREPLUS' as 'COREPLUS',
    LANMAN1: 'LANMAN1' as 'LANMAN1',
    LANMAN2: 'LANMAN2' as 'LANMAN2',
    NT1: 'NT1' as 'NT1',
    SMB2: 'SMB2' as 'SMB2',
    SMB2_02: 'SMB2_02' as 'SMB2_02',
    SMB2_10: 'SMB2_10' as 'SMB2_10',
    SMB2_22: 'SMB2_22' as 'SMB2_22',
    SMB2_24: 'SMB2_24' as 'SMB2_24',
    SMB3: 'SMB3' as 'SMB3',
    SMB3_00: 'SMB3_00' as 'SMB3_00'
};
type ServiceSmbMaxprotocol = (typeof ServiceSmbMaxprotocol)[keyof typeof ServiceSmbMaxprotocol];
export {ServiceSmbMaxprotocol};
