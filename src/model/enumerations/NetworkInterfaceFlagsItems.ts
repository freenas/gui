const NetworkInterfaceFlagsItems = {
    UP: 'UP' as 'UP',
    BROADCAST: 'BROADCAST' as 'BROADCAST',
    DEBUG: 'DEBUG' as 'DEBUG',
    LOOPBACK: 'LOOPBACK' as 'LOOPBACK',
    POINTOPOINT: 'POINTOPOINT' as 'POINTOPOINT',
    DRV_RUNNING: 'DRV_RUNNING' as 'DRV_RUNNING',
    NOARP: 'NOARP' as 'NOARP',
    PROMISC: 'PROMISC' as 'PROMISC',
    ALLMULTI: 'ALLMULTI' as 'ALLMULTI',
    DRV_OACTIVE: 'DRV_OACTIVE' as 'DRV_OACTIVE',
    SIMPLEX: 'SIMPLEX' as 'SIMPLEX',
    LINK0: 'LINK0' as 'LINK0',
    LINK1: 'LINK1' as 'LINK1',
    LINK2: 'LINK2' as 'LINK2',
    MULTICAST: 'MULTICAST' as 'MULTICAST',
    CANTCONFIG: 'CANTCONFIG' as 'CANTCONFIG',
    PPROMISC: 'PPROMISC' as 'PPROMISC',
    MONITOR: 'MONITOR' as 'MONITOR',
    STATICARP: 'STATICARP' as 'STATICARP',
    DYING: 'DYING' as 'DYING',
    RENAMING: 'RENAMING' as 'RENAMING'
};
type NetworkInterfaceFlagsItems = (typeof NetworkInterfaceFlagsItems)[keyof typeof NetworkInterfaceFlagsItems];
export {NetworkInterfaceFlagsItems};
