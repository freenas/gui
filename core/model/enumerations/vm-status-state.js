var Enum = require("montage/core/enum").Enum;

exports.VmStatusState = new Enum().initWithMembersAndValues(["BOOTLOADER","PAUSED","RUNNING","STOPPED"], ["BOOTLOADER","PAUSED","RUNNING","STOPPED"]);
