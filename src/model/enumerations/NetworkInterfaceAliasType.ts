const NetworkInterfaceAliasType = {
    INET: 'INET' as 'INET',
    INET6: 'INET6' as 'INET6'
};
type NetworkInterfaceAliasType = (typeof NetworkInterfaceAliasType)[keyof typeof NetworkInterfaceAliasType];
export {NetworkInterfaceAliasType};
