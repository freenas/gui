var Enum = require("montage/core/enum").Enum;

exports.NetworkAggregationProtocols = new Enum().initWithMembersAndValues(["NONE","ROUNDROBIN","FAILOVER","LOADBALANCE","LACP","ETHERCHANNEL"], ["NONE","ROUNDROBIN","FAILOVER","LOADBALANCE","LACP","ETHERCHANNEL"]);
