var Component = require("montage/ui/component").Component;

/**
 * @class Widget
 * @extends Component
 */
exports.Widget = Component.specialize({
    enterDocument: {
        value: function () {
            this._eventToSerie = {};
            this._subscribedUpdates = [];
            this._fetchStatistics();
        }
    },

    transformValue: {
        value: function(value) {
            if (typeof this.parentComponent.transformValue === 'function') {
                return this.parentComponent.transformValue(value);
            }
            return value;
        }
    },

    _addDatasourceToChart: {
        value: function (source, metric, prefix, suffix) {
            var hasSuffix = !!suffix;
            suffix = suffix || 'value';
            var self = this,
                path = source.children[metric].path.join('.') + '.' + suffix,
                serie = {
                    key: [metric, (hasSuffix ? suffix : '')].filter(function(x) { return x.length }).join('.').replace(prefix, '')
                };
            return self.application.statisticsService.subscribeToUpdates(path + '.pulse', self).then(function(eventType) {
                self._eventToSerie[eventType] = serie;
                self._subscribedUpdates.push(path + '.pulse');
            }).then(function() {
                return self.application.statisticsService.getDatasourceHistory(path)
            }).then(function (values) {
                serie.values = values.map(function (value) {
                        return {
                            x: value[0] * 1000,
                            y: self.transformValue(+value[1])
                        }
                    });
                self.chart.addSerie(serie);
            });
        }
    },

    _fetchStatistics: {
        value: function() {
            var self = this;

            return this.application.statisticsService.getDatasources().then(function(datasources) {
                return Object.keys(datasources)
                    .filter(function(x) { return x === self.source; })
                    .sort()
                    .map(function(x) { return datasources[x]; });
            }).then(function(sources) {
                var i, sourceLength, source,
                    j, metricsLength, metric;
                for (i = 0, sourceLength = sources.length; i < sourceLength; i++) {
                    source = sources[i];
                    for (j = 0, metricsLength = self.metrics.length; j < metricsLength; j++) {
                        metric = self.metrics[j];
                        if (typeof metric === 'object' && metric && metric.length) {
                            self._addDatasourceToChart(source, metric[0], self.removePrefix, metric[1]);
                        } else {
                            self._addDatasourceToChart(source, metric, self.removePrefix);
                        }
                    }
                }
            });
        }
    },

    handleEvent: {
        value: function(event) {
            var serie = this._eventToSerie[event.type];
            if (serie) {
                serie.values.shift();
                serie.values.push({
                    x: event.detail.timestamp * 1000,
                    y: this.transformValue(event.detail.value)
                });
                this.chart.refresh();
            }
        }
    }
});
