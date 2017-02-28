var Component = require("montage/ui/component").Component,
    DiskRepository = require('core/repository/disk-repository').DiskRepository;

exports.DiskTemperature = Component.specialize({
    templateDidLoad: {
        value: function() {
            this.diskRepository = DiskRepository.getInstance();
        }
    },

    enterDocument: {
        value: function () {
            var self = this;

            this.diskRepository.listDisks().then(function(disks) {
                self.disks = disks;
            });
        }
    }
});
