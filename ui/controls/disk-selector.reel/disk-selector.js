var Component = require("montage/ui/component").Component;

exports.DiskSelector = Component.specialize({
    enterDocument: {
        value: function() {
            this.disks = [];
        }
    },

    addDisk: {
        value: function(disk) {
            if (!this.hasDisk(disk)) {
                this.disks.push(disk);
                disk._usedInComponent = this;
            }
        }
    },

    removeDisk: {
        value: function(disk) {
            var diskIndex = this.disks.indexOf(disk);
            if (diskIndex !== -1) {
                this.disks.splice(diskIndex, 1);
            }
        }
    },

    hasDisk: {
        value: function(disk) {
            return this.disks.indexOf(disk) !== -1;
        }
    }
});
