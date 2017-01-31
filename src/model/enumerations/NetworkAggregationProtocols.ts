const NetworkAggregationProtocols = {
    NONE: 'NONE' as 'NONE',
    ROUNDROBIN: 'ROUNDROBIN' as 'ROUNDROBIN',
    FAILOVER: 'FAILOVER' as 'FAILOVER',
    LOADBALANCE: 'LOADBALANCE' as 'LOADBALANCE',
    LACP: 'LACP' as 'LACP'
};
type NetworkAggregationProtocols = (typeof NetworkAggregationProtocols)[keyof typeof NetworkAggregationProtocols];
export {NetworkAggregationProtocols};
