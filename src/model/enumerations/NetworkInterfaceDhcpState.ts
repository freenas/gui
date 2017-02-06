const NetworkInterfaceDhcpState = {
    INIT: 'INIT' as 'INIT',
    SELECTING: 'SELECTING' as 'SELECTING',
    REQUESTING: 'REQUESTING' as 'REQUESTING',
    INIT_REBOOT: 'INIT_REBOOT' as 'INIT_REBOOT',
    REBOOTING: 'REBOOTING' as 'REBOOTING',
    BOUND: 'BOUND' as 'BOUND',
    RENEWING: 'RENEWING' as 'RENEWING',
    REBINDING: 'REBINDING' as 'REBINDING'
};
type NetworkInterfaceDhcpState = (typeof NetworkInterfaceDhcpState)[keyof typeof NetworkInterfaceDhcpState];
export {NetworkInterfaceDhcpState};
