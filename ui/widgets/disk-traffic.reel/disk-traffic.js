/**
 * @module ui/disk-traffic.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class DiskTraffic
 * @extends Component
 */
exports.DiskTraffic = Component.specialize(/** @lends DiskTraffic# */ {
    enterDocument: {
        value: function() {
            if (!this.disks) {
                var self = this;
                this.application.dataService.fetchData(Model.Disk).then(function(disks) {
                    self.disks = disks;
                });
            }
        }
    }
});
