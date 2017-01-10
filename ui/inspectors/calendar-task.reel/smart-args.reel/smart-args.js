var Component = require("montage/ui/component").Component,
    DiskSelftestType = require('core/model/enumerations/disk-selftest-type').DiskSelftestType;

exports.SmartArgs = Component.specialize(/** @lends SmartArgs# */ {
    templateDidLoad: {
        value: function() {
            var self = this;
            this._sectionService.listDisks().then(function(disks) {
                self.disks = _.filter(disks, { online: true });
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
        value: function() {
            if (!this.object || this.object.length != 2) {
                this.object = [[], null];
                this.object.length = 2;
            }
        }
    }
});
