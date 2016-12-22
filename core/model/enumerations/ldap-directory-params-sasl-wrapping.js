var Enum = require("montage/core/enum").Enum;

exports.LdapDirectoryParamsSaslWrapping = new Enum().initWithMembersAndValues(["PLAIN","SEAL","SIGN"], ["PLAIN","SEAL","SIGN"]);
