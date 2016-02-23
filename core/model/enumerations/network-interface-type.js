var Enum = require("montage/core/enum").Enum;

exports.NetworkInterfaceType = new Enum().initWithMembersAndValues(["BRIDGE","ETHER","LAGG","LOOPBACK","VLAN"], ["BRIDGE","ETHER","LAGG","LOOPBACK","VLAN"]);
