const MailEncryptionType = {
    PLAIN: 'PLAIN' as 'PLAIN',
    TLS: 'TLS' as 'TLS',
    SSL: 'SSL' as 'SSL'
};
type MailEncryptionType = (typeof MailEncryptionType)[keyof typeof MailEncryptionType];
export {MailEncryptionType};
