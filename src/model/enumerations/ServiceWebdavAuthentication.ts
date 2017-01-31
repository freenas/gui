const ServiceWebdavAuthentication = {
    BASIC: 'BASIC' as 'BASIC',
    DIGEST: 'DIGEST' as 'DIGEST'
};
type ServiceWebdavAuthentication = (typeof ServiceWebdavAuthentication)[keyof typeof ServiceWebdavAuthentication];
export {ServiceWebdavAuthentication};
