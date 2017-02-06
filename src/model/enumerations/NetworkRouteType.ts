const NetworkRouteType = {
    INET: 'INET' as 'INET',
    INET6: 'INET6' as 'INET6'
};
type NetworkRouteType = (typeof NetworkRouteType)[keyof typeof NetworkRouteType];
export {NetworkRouteType};
