var Component = require("montage/ui/component").Component;

/**
 * @class MemoryAllocation
 * @extends Component
 */
exports.MemoryAllocation = Component.specialize({
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
        value: function (source, metric) {
            var self = this,
                path = source.children[metric].path.join('.') + '.value';
            this.application.statisticsService.getDatasourceHistory(path).then(function (values) {
                self.chart.addSerie({
                    key: source.label + '.' + metric.replace('memory-', ''),
                    values: values.map(function (value) {
                        return {x: value[0] * 1000, y: +value[1]}
                    })
                });
            })
        }
    },

    _fetchStatistics: {
        value: function() {
            var self = this;

            return this.application.statisticsService.getDatasources().then(function(datasources) {
                self._addDatasourceToChart(datasources.memory, 'memory-active');
                self._addDatasourceToChart(datasources.memory, 'memory-inactive');
                self._addDatasourceToChart(datasources.memory, 'memory-cache');
                self._addDatasourceToChart(datasources.memory, 'memory-free');
                self._addDatasourceToChart(datasources.memory, 'memory-wired');
            });
        }
    }
});
