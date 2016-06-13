var Enum = require("montage/core/enum").Enum;

exports.ServiceUpsMode = new Enum().initWithMembersAndValues(["MASTER","SLAVE"], ["MASTER","SLAVE"]);
