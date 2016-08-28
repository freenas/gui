var Enum = require("montage/core/enum").Enum;

exports.EncryptPluginType = new Enum().initWithMembersAndValues(["AES128","AES192","AES256"], ["AES128","AES192","AES256"]);
