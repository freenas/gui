var Enum = require("montage/core/enum").Enum;

exports.VmDeviceNicMode = new Enum().initWithMembersAndValues(["BRIDGED","HOSTONLY","MANAGEMENT","NAT"], ["BRIDGED","HOSTONLY","MANAGEMENT","NAT"]);
