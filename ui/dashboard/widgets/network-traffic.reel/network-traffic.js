var Component = require("montage/ui/component").Component;

/**
 * @class NetworkTraffic
 * @extends Component
 */
exports.NetworkTraffic = Component.specialize({
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
            this.application.statisticsService.getDatasourceHistory(path).then(function (values) {
                self.chart.addSerie({
                    key: source.label + '.' + [metric, suffix].join('.').replace('interface-', ''),
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
                self._addDatasourceToChart(datasources['interface-em0'], 'if_octets', 'rx');
                self._addDatasourceToChart(datasources['interface-em0'], 'if_octets', 'tx');
            });
        }
    }
});
