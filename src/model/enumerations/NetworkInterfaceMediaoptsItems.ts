const NetworkInterfaceMediaoptsItems = {
    AUTO: 'AUTO' as 'AUTO',
    MANUAL: 'MANUAL' as 'MANUAL',
    NONE: 'NONE' as 'NONE',
    FDX: 'FDX' as 'FDX',
    HDX: 'HDX' as 'HDX',
    FLOW: 'FLOW' as 'FLOW',
    FLAG0: 'FLAG0' as 'FLAG0',
    FLAG1: 'FLAG1' as 'FLAG1',
    FLAG2: 'FLAG2' as 'FLAG2',
    LOOP: 'LOOP' as 'LOOP'
};
type NetworkInterfaceMediaoptsItems = (typeof NetworkInterfaceMediaoptsItems)[keyof typeof NetworkInterfaceMediaoptsItems];
export {NetworkInterfaceMediaoptsItems};
