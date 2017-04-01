var Component = require("montage/ui/component").Component;

exports.AvailableDisks = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener("selectedHdd", this, "_handleSelectedDiskChange");
                this.addPathChangeListener("selectedSsd", this, "_handleSelectedDiskChange");
                this.addPathChangeListener("selectedDisk", this, "_handleSelectedDiskChange");
            }
        }
    },

    _handleSelectedDiskChange: {
        value: function(value, source) {
            if (value || source === 'selectedDisk') {
                if (this.selectedHdd || this.selectedSsd) {
                    if (this.selectedHdd === value) {
                        this.selectedSsd = null;
                    } else if (this.selectedSsd === value) {
                        this.selectedHdd = null;
                    } else {
                        this.selectedHdd = null;
                        this.selectedSsd = null;
                    }
                    this.selectedDisk = value;
                } else {
                    this.selectedDisk = null;
                }
            }
        }
    },

    _handleDisksChange: {
        value: function() {
            this.hdds = this.disks.filter(function(disk) { return disk.status && !disk.status.is_ssd; });
            this.ssds = this.disks.filter(function(disk) { return disk.status && disk.status.is_ssd; });
        }
    }
});
