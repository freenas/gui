var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    VmConfigBootloader = require("core/model/enumerations/vm-config-bootloader").VmConfigBootloader,
    VmDeviceType = require("core/model/enumerations/vm-device-type").VmDeviceType,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class VirtualMachineDevice
 * @extends Component
 */
exports.VirtualMachineDevice = Component.specialize({

    bootloaderOptions: {
        value: null
    },

    deviceList: {
        value: null
    },

    deviceTypes: {
        value: null
    },

    constructor: {
        value: function() {
            var deviceTypes = Array.from(VmDeviceType.members);
            deviceTypes.splice(deviceTypes.indexOf("VOLUME"), 1);
            this.deviceTypes = deviceTypes;

            this.bootloaderOptions = VmConfigBootloader.members;
        }
    },

    enterDocument: {
        value: function() {
            if (!this.object.type) {
                this.object.type = "DISK";
            }
            // FIXME: @thibaultzanini to provide a better API for interacting with
            // parent collection/context.
            this.deviceList = CascadingList.findPreviousContextWithComponent(this).object;
        }
    },

    exitDocument: {
        value: function() {
            this.deviceList = null;
        }
    },

    handleAddAction: {
        value: function() {

        }
    },

    handleRemoveAction: {
        value: function() {

        }
    }
});
