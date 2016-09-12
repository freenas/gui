var Enum = require("montage/core/enum").Enum;

exports.DatasetType = new Enum().initWithMembersAndValues(["BOOKMARK","FILESYSTEM","SNAPSHOT","VOLUME"], ["BOOKMARK","FILESYSTEM","SNAPSHOT","VOLUME"]);
