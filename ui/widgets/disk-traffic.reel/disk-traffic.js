/**
 * @module ui/disk-traffic.reel
 */
var Component = require("montage/ui/component").Component,
    DashboardSectionService = require("core/service/section/dashboard-section-service").DashboardSectionService;

/**
 * @class DiskTraffic
 * @extends Component
 */
exports.DiskTraffic = Component.specialize(/** @lends DiskTraffic# */ {

    templateDidLoad: {
        value: function() {
            var self = this;
            DashboardSectionService.instance.then(function(sectionService) {
                self._sectionService = sectionService;
            });
        }
    },

    enterDocument: {
        value: function() {
            if (!this.disks) {
                this.disks = this._sectionService.loadDisks();
                this._refreshChart();
            }
        }
    },

    getChartKey: {
        value: function(source, metric, suffix, isTimeSeries) {
            if (!isTimeSeries) {
                return suffix;
            }
            return null;
        }
    },

    getChartLabel: {
        value: function(source, metric, suffix, isTimeSeries) {
            if (!isTimeSeries) {
                return metric.replace('geom_ops_rwd-', '').replace('multipath_', '');
            }
            return null;
        }
    },

    _refreshChart: {
        value: function() {
            this.chart.metrics = this.disks.map(function(disk) {
                return [
                    ['geom_ops_rwd-' + (disk.is_multipath ? 'multipath_' : '') + disk.name, 'read'],
                    ['geom_ops_rwd-' + (disk.is_multipath ? 'multipath_' : '') + disk.name, 'write']
                ];
            }).flatten();
            this.chart.sources = ['geom_stat'];
        }
    }
});
