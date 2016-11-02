var Enum = require("montage/core/enum").Enum;

exports.VmStatusHealth = new Enum().initWithMembersAndValues(["DEAD","DYING","HEALTHY","UNKNOWN"], ["DEAD","DYING","HEALTHY","UNKNOWN"]);
