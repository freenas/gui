var Enum = require("montage/core/enum").Enum;

exports.MailEncryptionType = new Enum().initWithMembersAndValues(["PLAIN","SSL","TLS"], ["PLAIN","SSL","TLS"]);
