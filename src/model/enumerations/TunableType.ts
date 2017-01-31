const TunableType = {
    LOADER: 'LOADER' as 'LOADER',
    RC: 'RC' as 'RC',
    SYSCTL: 'SYSCTL' as 'SYSCTL'
};
type TunableType = (typeof TunableType)[keyof typeof TunableType];
export {TunableType};
