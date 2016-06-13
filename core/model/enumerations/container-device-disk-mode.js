var Enum = require("montage/core/enum").Enum;

exports.ContainerDeviceDiskMode = new Enum().initWithMembersAndValues(["AHCI","VIRTIO"], ["AHCI","VIRTIO"]);
