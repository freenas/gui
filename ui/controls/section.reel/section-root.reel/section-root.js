var Component = require("montage/ui/component").Component;

exports.SectionRoot = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener("selectedObject", this, "_handleSelectionChange");
                this.addPathChangeListener("selectedEntry", this, "_handleSelectionChange");
                this.addPathChangeListener("selectedExtraEntry", this, "_handleSelectionChange");
            }
            this._disableSectionIfNecessary();
        }
    },

    _handleSelectionChange: {
        value: function(value) {
            if (value) {
                if (this.selectedEntry !== value) {
                    this.selectedEntry = null;
                }
                if (this.selectedExtraEntry !== value) {
                    this.selectedExtraEntry = null;
                }
            }
            if (this.selectedObject !== value) {
                this.selectedObject = value;
            } else {
                this.selectedEntry = this.selectedExtraEntry = value;
            }
        }
    },

    _disableSectionIfNecessary: {
        value: function() {
            var self = this;

            if (this.object.id === 'vms' || this.object.id === 'containers') {
                return this.application.virtualMachineService.getHardwareCapabilities().then(function(hardware) {
                    self._disabledMessage = !hardware.vtx_enabled && !hardware.svm_features ?
                        'The CPU does not support virtualization.' : null;
                });
            }

            this._disabledMessage = null;
        }
    }
});
