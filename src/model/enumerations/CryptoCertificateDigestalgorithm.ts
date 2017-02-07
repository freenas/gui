const CryptoCertificateDigestalgorithm = {
    SHA1: 'SHA1' as 'SHA1',
    SHA224: 'SHA224' as 'SHA224',
    SHA256: 'SHA256' as 'SHA256',
    SHA384: 'SHA384' as 'SHA384',
    SHA512: 'SHA512' as 'SHA512'
};
type CryptoCertificateDigestalgorithm = (typeof CryptoCertificateDigestalgorithm)[keyof typeof CryptoCertificateDigestalgorithm];
export {CryptoCertificateDigestalgorithm};
