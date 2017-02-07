const ShareNfsSecurityItems = {
    sys: 'sys' as 'sys',
    krb5: 'krb5' as 'krb5',
    krb5i: 'krb5i' as 'krb5i',
    krb5p: 'krb5p' as 'krb5p'
};
type ShareNfsSecurityItems = (typeof ShareNfsSecurityItems)[keyof typeof ShareNfsSecurityItems];
export {ShareNfsSecurityItems};
