var Enum = require("montage/core/enum").Enum;

exports.ServiceState = new Enum().initWithMembersAndValues(["RUNNING","STOPPED","UNKNOWN"], ["RUNNING","STOPPED","UNKNOWN"]);
