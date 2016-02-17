var Enum = require("montage/core/enum").Enum;

exports.AlertSeverity = new Enum().initWithMembersAndValues(["CRITICAL","WARNING","INFO"], ["CRITICAL","WARNING","INFO"]);
