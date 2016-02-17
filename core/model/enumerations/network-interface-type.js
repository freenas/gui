var Enum = require("montage/core/enum").Enum;

exports.NetworkInterfaceType = new Enum().initWithMembersAndValues(["LOOPBACK","ETHER","VLAN","BRIDGE","LAGG"], ["LOOPBACK","ETHER","VLAN","BRIDGE","LAGG"]);
