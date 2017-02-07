const ShareTypesPermtype = {
    PERM: 'PERM' as 'PERM',
    ACL: 'ACL' as 'ACL'
};
type ShareTypesPermtype = (typeof ShareTypesPermtype)[keyof typeof ShareTypesPermtype];
export {ShareTypesPermtype};
