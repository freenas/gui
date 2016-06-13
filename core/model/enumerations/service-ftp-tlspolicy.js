var Enum = require("montage/core/enum").Enum;

exports.ServiceFtpTlspolicy = new Enum().initWithMembersAndValues(["!DATA","AUTH","AUTH+!DATA","AUTH+DATA","CTRL","CTRL+!DATA","CTRL+DATA","DATA","OFF","ON"], ["!DATA","AUTH","AUTH+!DATA","AUTH+DATA","CTRL","CTRL+!DATA","CTRL+DATA","DATA","OFF","ON"]);
