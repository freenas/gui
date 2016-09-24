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
            if (isFirstTime) {
                this._selectionService = this.application.selectionService;
                this._virtualMachineService = this.application.virtualMachineService;
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "_handleSelectionChange");
            }

            this._populateNewDeviceObjectList();
            if (this.parentCascadingListItem) {
                this.parentCascadingListItem.selectedObject = null;
            }
        }
    },

    _populateNewDeviceObjectList: {
        value: function () {
            var virtualMachineService = this._virtualMachineService;

            //todo: block draw gate, in order to avoid some odd behavior.
            Promise.all([
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
                //todo: can draw
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
});
