var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VirtualMachineDeviceDisk = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this.diskModeOptions = this._sectionService.DISK_MODES;
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            this.object._diskSize = this._sectionService.convertDiskSizeToString(this.object.size);
            if (isFirsttime) {
                this.addPathChangeListener("object._diskSize", this, "_handleDiskSizeChange");
            }
        }
    },

    _handleDiskSizeChange: {
        value: function() {
            if (this._inDocument) {
                this.object.size = this._sectionService.convertDiskSizeStringToSize(this.object._diskSize);
            }
        }
    }
});
