var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    VmDeviceVolumeType = require("core/model/enumerations/vm-device-volume-type").VmDeviceVolumeType,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class VirtualMachineVolume
 * @extends Component
 */
exports.VirtualMachineVolume = AbstractInspector.specialize({
    volumeTypeOptions: {
        value: null
    },

    constructor: {
        value: function() {
            this.volumeTypeOptions = VmDeviceVolumeType.members;
        }
    },

    exitDocument: {
        value: function() {
            this.superExitDocument();
        }
    },

    enterDocument: {
        value: function() {
            this.superEnterDocument();
            if (!!this.object._isNew) {
                this.object.type = "VOLUME";
                if (!this.object.properties) {
                    this.object.properties = {
                        type: "VT9P"
                    };
                }
            }
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
            var volumeList = this._getContext().object,
                index = -1;
            for (var i=0, length=volumeList.length; i<length; i++) {
                if (volumeList[i].name === this.object.name) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                volumeList.splice(index, 1);
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
