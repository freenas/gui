const CryptoCertificateType = {
    CA_EXISTING: 'CA_EXISTING' as 'CA_EXISTING',
    CA_INTERMEDIATE: 'CA_INTERMEDIATE' as 'CA_INTERMEDIATE',
    CA_INTERNAL: 'CA_INTERNAL' as 'CA_INTERNAL',
    CERT_CSR: 'CERT_CSR' as 'CERT_CSR',
    CERT_EXISTING: 'CERT_EXISTING' as 'CERT_EXISTING',
    CERT_INTERMEDIATE: 'CERT_INTERMEDIATE' as 'CERT_INTERMEDIATE',
    CERT_INTERNAL: 'CERT_INTERNAL' as 'CERT_INTERNAL'
};
type CryptoCertificateType = (typeof CryptoCertificateType)[keyof typeof CryptoCertificateType];
export {CryptoCertificateType};
