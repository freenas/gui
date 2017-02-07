const NetworkInterfaceType = {
    LOOPBACK: 'LOOPBACK' as 'LOOPBACK',
    ETHER: 'ETHER' as 'ETHER',
    VLAN: 'VLAN' as 'VLAN',
    BRIDGE: 'BRIDGE' as 'BRIDGE',
    LAGG: 'LAGG' as 'LAGG'
};
type NetworkInterfaceType = (typeof NetworkInterfaceType)[keyof typeof NetworkInterfaceType];
export {NetworkInterfaceType};
