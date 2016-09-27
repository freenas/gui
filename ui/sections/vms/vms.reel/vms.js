var Component = require("montage/ui/component").Component,
    VmsSectionService = require("core/service/section/vms-section-service").VmsSectionService;

exports.Vms = Component.specialize({
    templateDidLoad: {
        value: function() {
            var self = this;
            this._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, false);
            this._service = VmsSectionService.instance;
            this._service.listEntries().then(function(entries) {
                self.entries = entries;
                self._canDrawGate.setField(self.constructor.DRAW_GATE_FIELD, true);
            });
        }
    }
}, {
    DRAW_GATE_FIELD: {
        value: "entriesLoaded"
    }
});
