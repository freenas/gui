var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

exports.SectionRoot = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (isFirstTime) {
                this.addPathChangeListener("selectedObject", this, "_handleSelectionChange");
                this.addPathChangeListener("selectedEntry", this, "_handleSelectionChange");
                this.addPathChangeListener("selectedExtraEntry", this, "_handleSelectionChange");
            }
            this._disableSectionIfNecessary();
            this.object.entriesTitle = this._sectionService.entriesTitle;
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
