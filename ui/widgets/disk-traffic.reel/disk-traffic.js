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
                    self._refreshChart();
                });
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
                return metric.split('-')[1];
            }
            return null;
        }
    },

    _refreshChart: {
        value: function() {
            this.chart.metrics = this.disks.map(function(disk) {
                return [
                    ['geom_ops_rwd-' + disk.name, 'read'],
                    ['geom_ops_rwd-' + disk.name, 'write']
                ];
            }).flatten();
            this.chart.sources = ['geom_stat'];
        }
    }
});
