const LdapDirectoryParamsEncryption = {
    OFF: 'OFF' as 'OFF',
    SSL: 'SSL' as 'SSL',
    TLS: 'TLS' as 'TLS'
};
type LdapDirectoryParamsEncryption = (typeof LdapDirectoryParamsEncryption)[keyof typeof LdapDirectoryParamsEncryption];
export {LdapDirectoryParamsEncryption};
