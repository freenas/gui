const NetworkInterfaceCapabilitiesItems = {
    RXCSUM: 'RXCSUM' as 'RXCSUM',
    TXCSUM: 'TXCSUM' as 'TXCSUM',
    NETCONS: 'NETCONS' as 'NETCONS',
    VLAN_MTU: 'VLAN_MTU' as 'VLAN_MTU',
    VLAN_HWTAGGING: 'VLAN_HWTAGGING' as 'VLAN_HWTAGGING',
    JUMBO_MTU: 'JUMBO_MTU' as 'JUMBO_MTU',
    POLLING: 'POLLING' as 'POLLING',
    VLAN_HWCSUM: 'VLAN_HWCSUM' as 'VLAN_HWCSUM',
    TSO4: 'TSO4' as 'TSO4',
    TSO6: 'TSO6' as 'TSO6',
    LRO: 'LRO' as 'LRO',
    WOL_UCAST: 'WOL_UCAST' as 'WOL_UCAST',
    WOL_MCAST: 'WOL_MCAST' as 'WOL_MCAST',
    WOL_MAGIC: 'WOL_MAGIC' as 'WOL_MAGIC',
    TOE4: 'TOE4' as 'TOE4',
    TOE6: 'TOE6' as 'TOE6',
    VLAN_HWFILTER: 'VLAN_HWFILTER' as 'VLAN_HWFILTER',
    POLLING_NOCOUNT: 'POLLING_NOCOUNT' as 'POLLING_NOCOUNT',
    VLAN_HWTSO: 'VLAN_HWTSO' as 'VLAN_HWTSO',
    LINKSTATE: 'LINKSTATE' as 'LINKSTATE',
    NETMAP: 'NETMAP' as 'NETMAP',
    RXCSUM_IPV6: 'RXCSUM_IPV6' as 'RXCSUM_IPV6',
    TXCSUM_IPV6: 'TXCSUM_IPV6' as 'TXCSUM_IPV6',
    HWSTATS: 'HWSTATS' as 'HWSTATS'
};
type NetworkInterfaceCapabilitiesItems = (typeof NetworkInterfaceCapabilitiesItems)[keyof typeof NetworkInterfaceCapabilitiesItems];
export {NetworkInterfaceCapabilitiesItems};
