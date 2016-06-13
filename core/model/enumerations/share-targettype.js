var Enum = require("montage/core/enum").Enum;

exports.ShareTargettype = new Enum().initWithMembersAndValues(["DATASET","DIRECTORY","FILE","ZVOL"], ["DATASET","DIRECTORY","FILE","ZVOL"]);
