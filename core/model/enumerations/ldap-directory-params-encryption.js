var Enum = require("montage/core/enum").Enum;

exports.LdapDirectoryParamsEncryption = new Enum().initWithMembersAndValues(["OFF","SSL","TLS"], ["OFF","SSL","TLS"]);
