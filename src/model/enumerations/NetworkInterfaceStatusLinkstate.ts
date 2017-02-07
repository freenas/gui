const NetworkInterfaceStatusLinkstate = {
    LINK_STATE_UNKNOWN: 'LINK_STATE_UNKNOWN' as 'LINK_STATE_UNKNOWN',
    LINK_STATE_DOWN: 'LINK_STATE_DOWN' as 'LINK_STATE_DOWN',
    LINK_STATE_UP: 'LINK_STATE_UP' as 'LINK_STATE_UP'
};
type NetworkInterfaceStatusLinkstate = (typeof NetworkInterfaceStatusLinkstate)[keyof typeof NetworkInterfaceStatusLinkstate];
export {NetworkInterfaceStatusLinkstate};
