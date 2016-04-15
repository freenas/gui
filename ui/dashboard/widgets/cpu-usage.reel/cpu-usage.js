var Component = require("montage/ui/component").Component;

/**
 * @class CpuUsage
 * @extends Component
 */
exports.CpuUsage = Component.specialize({
    enterDocument: {
        value: function () {
            this._fetchStatistics();
        }
    },

    _addDatasourceToChart: {
        value: function (cpu, metric) {
            var self = this,
                path = cpu.children[metric].path.join('.') + '.value';
            this.application.statisticsService.getDatasourceHistory(path).then(function (values) {
                self.chart.addSerie({
                    key: cpu.label + '.' + metric.replace('cpu-', ''),
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

            this.application.statisticsService.getDatasources().then(function(datasources) {
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
