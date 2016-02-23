var Enum = require("montage/core/enum").Enum;

exports.AlertSeverity = new Enum().initWithMembersAndValues(["CRITICAL","INFO","WARNING"], ["CRITICAL","INFO","WARNING"]);
