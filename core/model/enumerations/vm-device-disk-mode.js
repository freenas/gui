var Enum = require("montage/core/enum").Enum;

exports.VmDeviceDiskMode = new Enum().initWithMembersAndValues(["AHCI","VIRTIO"], ["AHCI","VIRTIO"]);
