var Component = require("montage/ui/component").Component;

/**
 * @class Widget
 * @extends Component
 */
exports.Widget = Component.specialize({
    _source: {
        value: null
    },

    source: {
        get: function() {
            return this._source;
        },
        set: function(source) {
            if (this._source != source) {
                this._source = source;
                this._initializeData();
            }
        }
    },

    _statisticsService: {
        value: null
    },

    constructor: {
        value: function() {
            this._statisticsService = this.application.statisticsService;
        }
    },

    enterDocument: {
        value: function () {
            this._initializeData();
        }
    },

    exitDocument: {
        value: function() {
            var i, length;
            for (i = 0, length = this._subscribedUpdates.length; i < length; i++) {
                this._statisticsService.unSubscribeToUpdates(this._subscribedUpdates[i]);
            }
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

    _initializeData: {
        value: function() {
            this._eventToSerie = {};
            this._subscribedUpdates = [];
            this._fetchStatistics();
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
                },
                event = path + '.pulse';
            return self._statisticsService.subscribeToUpdates(event, self).then(function(eventType) {
                self._eventToSerie[eventType] = serie;
                self._subscribedUpdates.push(event);
            }).then(function() {
                return self._statisticsService.getDatasourceHistory(path)
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

            return this._statisticsService.getDatasources().then(function(datasources) {
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
                if (!serie.values) {
                    serie.values = [];
                }
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
