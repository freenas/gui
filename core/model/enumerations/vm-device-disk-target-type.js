var Enum = require("montage/core/enum").Enum;

exports.VmDeviceDiskTargetType = new Enum().initWithMembersAndValues(["FILE","BLOCK", "DISK"], ["FILE","BLOCK", "DISK"]);
