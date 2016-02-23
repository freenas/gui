var Enum = require("montage/core/enum").Enum;

exports.DatasetType = new Enum().initWithMembersAndValues(["FILESYSTEM","SNAPSHOT","VOLUME"], ["FILESYSTEM","SNAPSHOT","VOLUME"]);
