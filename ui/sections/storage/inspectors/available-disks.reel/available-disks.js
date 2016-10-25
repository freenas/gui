var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

exports.AvailableDisks = Component.specialize({
    _handleDisksChange: {
        value: function() {
            this.hdds = this.disks.filter(function(disk) { return disk.status && !disk.status.is_ssd; });
            this.ssds = this.disks.filter(function(disk) { return disk.status && disk.status.is_ssd; });
        }
    }
});
