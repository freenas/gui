var Enum = require("montage/core/enum").Enum;

exports.UpdateOpsOperation = new Enum().initWithMembersAndValues(["delete","install","upgrade"], ["delete","install","upgrade"]);
