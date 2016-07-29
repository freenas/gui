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

    editMode: {
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
            this.editMode = this.object._isNew ? "create" : "edit";
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
            var deviceList = this.deviceList,
                index = -1;
            for (var i=0, length=deviceList.length; i<length; i++) {
                if (deviceList[i].name === this.object.name) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                deviceList.splice(index, 1);
            }
        }
    }
});
