var Component = require("montage/ui/component").Component;

/**
 * @class CpuUsage
 * @extends Component
 */
exports.CpuUsage = Component.specialize({
    enterDocument: {
        value: function () {
            var self = this;
            this._fetchStatistics().then(function() {
                setInterval(function() {
                    self._fetchStatistics();
                }, 10000);
            });
        }
    },

    _addDatasourceToChart: {
        value: function (source, metric, suffix) {
            suffix = suffix || 'value';
            var self = this,
                path = source.children[metric].path.join('.') + '.' + suffix;
            return this.application.statisticsService.getDatasourceHistory(path).then(function (values) {
                self.chart.addSerie({
                    key: source.label + '.' + metric.replace('cpu-', ''),
                    values: values.map(function (value) {
                        return {x: value[0] * 1000, y: +value[1]/100}
                    })
                });
            })
        }
    },

    _fetchStatistics: {
        value: function() {
            var self = this;

            return this.application.statisticsService.getDatasources().then(function(datasources) {
                return Object.keys(datasources).filter(function(x) { return x.indexOf('cpu-') == 0; }).sort().map(function(x) { return datasources[x]; });
            }).then(function(cpus) {
                var i, length, cpu;
                for (i = 0, length = cpus.length; i < length; i++) {
                    cpu = cpus[i];
                    self._addDatasourceToChart(cpu, 'cpu-user');
                    self._addDatasourceToChart(cpu, 'cpu-system');
                }
            });
        }
    }
});
