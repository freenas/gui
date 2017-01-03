var Enum = require("montage/core/enum").Enum;

exports.ServiceState = new Enum().initWithMembersAndValues(["ERROR","RUNNING","STARTING","STOPPED","STOPPING","UNKNOWN"], ["ERROR","RUNNING","STARTING","STOPPED","STOPPING","UNKNOWN"]);
