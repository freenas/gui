var Enum = require("montage/core/enum").Enum;

exports.ZfsVdevType = new Enum().initWithMembersAndValues(["disk","file","mirror","raidz1","raidz2","raidz3"], ["disk","file","mirror","raidz1","raidz2","raidz3"]);
