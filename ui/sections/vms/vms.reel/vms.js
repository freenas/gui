var Component = require("montage/ui/component").Component,
    VmsSectionService = require("core/service/section/vms-section-service").VmsSectionService;

exports.Vms = Component.specialize({
    templateDidLoad: {
        value: function() {
            var self = this;
            this._service = VmsSectionService.instance;
            this._service.listEntries().then(function(entries) {
                self.entries = entries;
            });
        }
    }
});
