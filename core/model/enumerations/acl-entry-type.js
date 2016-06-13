var Enum = require("montage/core/enum").Enum;

exports.AclEntryType = new Enum().initWithMembersAndValues(["ALLOW","DENY"], ["ALLOW","DENY"]);
