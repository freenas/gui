var Component = require("montage/ui/component").Component,
    VmDeviceDiskMode = require("core/model/enumerations/vm-device-disk-mode").VmDeviceDiskMode;

/**
 * @class VirtualMachineDeviceDisk
 * @extends Component
 */
exports.VirtualMachineDeviceDisk = Component.specialize({

    _diskSize: {
        value: null
    },

    diskSize: {
        get: function () {
            if (typeof this._diskSize === "string") {
                return this._diskSize;
            } else if (!!this.object.size && typeof this.object.size === "number") {
                return this.application.storageService.convertBytesToSizeString(this.object.size);
            }
            return "";
        },

        set: function(diskSize) {
            var convertedBytes = this.application.storageService.convertSizeStringToBytes(diskSize);
            if (this._diskSize !== diskSize) {
                this._diskSize = diskSize;
                this.object.size = convertedBytes ? convertedBytes : this.object.size;
            }
        }
    },

    diskModeOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.diskModeOptions = VmDeviceDiskMode.members;
        }
    },

    enterDocument: {
        value: function() {
            if (typeof this.object.size === "number") {
                this.diskSize = this.application.storageService.convertBytesToSizeString(this.object.size);
            }
        }
    },

    exitDocument: {
        value: function() {
            this.diskSize = null;
        }
    }
});
