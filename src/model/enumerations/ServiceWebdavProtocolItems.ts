const ServiceWebdavProtocolItems = {
    HTTP: 'HTTP' as 'HTTP',
    HTTPS: 'HTTPS' as 'HTTPS'
};
type ServiceWebdavProtocolItems = (typeof ServiceWebdavProtocolItems)[keyof typeof ServiceWebdavProtocolItems];
export {ServiceWebdavProtocolItems};
