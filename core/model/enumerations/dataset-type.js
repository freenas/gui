var Enum = require("montage/core/enum").Enum;

exports.DatasetType = new Enum().initWithMembersAndValues(["FILESYSTEM","VOLUME","SNAPSHOT"], ["FILESYSTEM","VOLUME","SNAPSHOT"]);
