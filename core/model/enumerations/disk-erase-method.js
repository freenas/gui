var Enum = require("montage/core/enum").Enum;

exports.DiskEraseMethod = new Enum().initWithMembersAndValues(["QUICK","ZEROS","RANDOM"], ["QUICK","ZEROS","RANDOM"]);
