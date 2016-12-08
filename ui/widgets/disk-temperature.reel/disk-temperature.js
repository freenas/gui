/**
 * @module ui/disk-temperature.reel
 */
var Component = require("montage/ui/component").Component,
    DashboardSectionService = require("core/service/section/dashboard-section-service").DashboardSectionService;

/**
 * @class DiskTemperature
 * @extends Component
 */
exports.DiskTemperature = Component.specialize(/** @lends DiskTemperature# */ {

    templateDidLoad: {
        value: function() {
            var self = this;
            DashboardSectionService.instance.then(function(sectionService) {
                self._sectionService = sectionService;
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            if (!this.disks) {
                this.disks = this._sectionService.loadDisks();
            }
        }
    }
});
