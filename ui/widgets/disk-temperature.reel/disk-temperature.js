/**
 * @module ui/disk-temperature.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class DiskTemperature
 * @extends Component
 */
exports.DiskTemperature = Component.specialize(/** @lends DiskTemperature# */ {

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            if (!this.disks) {
                this.application.dataService.fetchData(Model.Disk).then(function(disks) {
                    self.disks = disks;
                });
            }
        }
    }
});
