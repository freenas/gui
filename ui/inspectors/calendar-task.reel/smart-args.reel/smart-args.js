var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    DiskSelftestType = require('core/model/enumerations/disk-selftest-type').DiskSelftestType,
    _ = require("lodash");

exports.SmartArgs = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this._sectionService.listDisks().then(function(disks) {
                self.disks = _.sortBy(_.filter(disks, { online: true, smart: true }), 'path');
            });
            this.testTypes = DiskSelftestType.members.map(function(x) {
                return {
                    label: x.toLowerCase().toCapitalized(),
                    value: x
                };
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (this.isNew) {
                this.object.clear();
                this.object.push([], null);
            }
        }
    }
});
