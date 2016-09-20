var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    VmConfigBootloader = require("core/model/enumerations/vm-config-bootloader").VmConfigBootloader,
    VmDeviceType = require("core/model/enumerations/vm-device-type").VmDeviceType,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Promise = require("montage/core/promise").Promise;

/**
 * @class VirtualMachineDevice
 * @extends Component
 */
exports.VirtualMachineDevice = AbstractInspector.specialize({

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

    handleAddAction: {
        value: function() {
            var context = this._getContext();
            this.object._isNew = false;
            context.object.push(this.object);
            context.cascadingListItem.selectedObject = null;
        }
    },

    handleRemoveAction: {
        value: function() {
            var deviceList = this._getContext().object,
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
    },

    _getContext: {
        value: function() {
            // FIXME: @thibaultzanini to provide a better API for interacting with
            // parent collection/context.
            return CascadingList.findPreviousContextWithComponent(this);
        }
    }
});
