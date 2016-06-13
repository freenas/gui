var Enum = require("montage/core/enum").Enum;

exports.ContainerType = new Enum().initWithMembersAndValues(["DOCKER","JAIL","VM"], ["DOCKER","JAIL","VM"]);
