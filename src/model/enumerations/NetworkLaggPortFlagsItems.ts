const NetworkLaggPortFlagsItems = {
    SLAVE: 'SLAVE' as 'SLAVE',
    MASTER: 'MASTER' as 'MASTER',
    STACK: 'STACK' as 'STACK',
    ACTIVE: 'ACTIVE' as 'ACTIVE',
    COLLECTING: 'COLLECTING' as 'COLLECTING',
    DISTRIBUTING: 'DISTRIBUTING' as 'DISTRIBUTING',
    DISABLED: 'DISABLED' as 'DISABLED'
};
type NetworkLaggPortFlagsItems = (typeof NetworkLaggPortFlagsItems)[keyof typeof NetworkLaggPortFlagsItems];
export {NetworkLaggPortFlagsItems};
