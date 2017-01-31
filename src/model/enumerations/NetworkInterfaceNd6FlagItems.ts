const NetworkInterfaceNd6FlagItems = {
    PERFORMNUD: 'PERFORMNUD' as 'PERFORMNUD',
    ACCEPT_RTADV: 'ACCEPT_RTADV' as 'ACCEPT_RTADV',
    PREFER_SOURCE: 'PREFER_SOURCE' as 'PREFER_SOURCE',
    IFDISABLED: 'IFDISABLED' as 'IFDISABLED',
    DONT_SET_IFROUTE: 'DONT_SET_IFROUTE' as 'DONT_SET_IFROUTE',
    AUTO_LINKLOCAL: 'AUTO_LINKLOCAL' as 'AUTO_LINKLOCAL',
    NO_RADR: 'NO_RADR' as 'NO_RADR',
    NO_PREFER_IFACE: 'NO_PREFER_IFACE' as 'NO_PREFER_IFACE'
};
type NetworkInterfaceNd6FlagItems = (typeof NetworkInterfaceNd6FlagItems)[keyof typeof NetworkInterfaceNd6FlagItems];
export {NetworkInterfaceNd6FlagItems};
