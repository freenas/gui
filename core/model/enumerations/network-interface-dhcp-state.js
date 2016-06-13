var Enum = require("montage/core/enum").Enum;

exports.NetworkInterfaceDhcpState = new Enum().initWithMembersAndValues(["BOUND","INIT","INIT_REBOOT","REBINDING","REBOOTING","RENEWING","REQUESTING","SELECTING"], ["BOUND","INIT","INIT_REBOOT","REBINDING","REBOOTING","RENEWING","REQUESTING","SELECTING"]);
