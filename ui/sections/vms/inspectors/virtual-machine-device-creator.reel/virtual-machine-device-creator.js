var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class VirtualMachineDeviceCreator
 * @extends Component
 */
exports.VirtualMachineDeviceCreator = Component.specialize({

    newCdromDevice: {
        value: null
    },

    newDiskDevice: {
        value: null
    },

    newGraphicsDevice: {
        value: null
    },

    newNicDevice: {
        value: null
    },

    newUsbDevice: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return CascadingList.findCascadingListItemContextWithComponent(this);
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this._virtualMachineService = this.application.virtualMachineService;
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "_handleSelectionChange");
            }

            this._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, false);
            this._populateNewDeviceObjectList().then(function() {
                self._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, true);
            });
            if (this.parentCascadingListItem) {
                this.parentCascadingListItem.selectedObject = null;
            }
        }
    },

    _populateNewDeviceObjectList: {
        value: function () {
            var virtualMachineService = this._virtualMachineService;

            return Promise.all([
                virtualMachineService.createCdromDevice(),
                virtualMachineService.createDiskDevice(),
                virtualMachineService.createGraphicsDevice(),
                virtualMachineService.createNicDevice(),
                virtualMachineService.createUsbDevice()
            ]).bind(this).then(function (devices) {
                this.newCdromDevice = devices[0];
                this.newDiskDevice = devices[1];
                this.newGraphicsDevice = devices[2];
                this.newNicDevice = devices[3];
                this.newUsbDevice = devices[4];
            });
        }
    },

    _handleSelectionChange: {
        value: function () {
            if (this.parentCascadingListItem && this.parentCascadingListItem.selectedObject) {
                if (this._inDocument) {
                    this.parentCascadingListItem.cascadingList.pop();
                }
            }
        }
    }
}, {
    DRAW_GATE_FIELD: {
        value: "devicesLoaded"
    }
});
