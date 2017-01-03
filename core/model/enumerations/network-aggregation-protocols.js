var Enum = require("montage/core/enum").Enum;

exports.NetworkAggregationProtocols = new Enum().initWithMembersAndValues(["FAILOVER","LACP","LOADBALANCE","NONE","ROUNDROBIN"], ["FAILOVER","LACP","LOADBALANCE","NONE","ROUNDROBIN"]);
