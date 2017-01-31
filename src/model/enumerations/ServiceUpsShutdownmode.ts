const ServiceUpsShutdownmode = {
    LOWBATT: 'LOWBATT' as 'LOWBATT',
    BATT: 'BATT' as 'BATT'
};
type ServiceUpsShutdownmode = (typeof ServiceUpsShutdownmode)[keyof typeof ServiceUpsShutdownmode];
export {ServiceUpsShutdownmode};
