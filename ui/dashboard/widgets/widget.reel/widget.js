var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

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

    _timezoneOffset: {
        get: function () {
            if (!this.constructor._timezoneOffset) {
                this.constructor._timezoneOffset = new Date().getTimezoneOffset() * 60000;
            }

            return this.constructor._timezoneOffset;
        }
    },

    _statisticsService: {
        get: function() {
            return this.application.statisticsService;
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
            if (this._subscribedUpdates) {
                for (i = 0, length = this._subscribedUpdates.length; i < length; i++) {
                    this._statisticsService.unSubscribeToUpdates(this._subscribedUpdates[i]);
                }
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
            if (!this._isFetchingStatistics && this._source) {
                this._eventToKey = {};
                this._subscribedUpdates = [];
                this._fetchStatistics();
            }
        }
    },

    _addDatasourceToChart: {
        value: function (source, metric, prefix, suffix) {
            var hasSuffix = !!suffix;
            suffix = suffix || 'value';
            var self = this,
                path = source.children[metric].path.join('.') + '.' + suffix,
                key = [metric, (hasSuffix ? suffix : '')].filter(function(x) { return x.length }).join('.').replace(prefix, ''),
                serie = {
                    key: key
                },
                event = path + '.pulse';

            return self._statisticsService.getDatasourceHistory(path).then(function (values) {
                serie.values = values.map(function (value) {
                        return {
                            x: self._dateToTimestamp(value[0]),
                            y: self.transformValue(+value[1])
                        }
                    });
                serie.disabled = self.disabledMetrics && self.disabledMetrics.indexOf(metric) != -1;
                return self.chart.addSerie(serie);
            }).then(function() {
                if (self._inDocument) {
                    return self._statisticsService.subscribeToUpdates(event, self).then(function(eventType) {
                        self._eventToKey[eventType] = key;
                        self._subscribedUpdates.push(event);
                    });
                } else {
                    return false;
                }
            });

        }
    },

    _fetchStatistics: {
        value: function() {
            var self = this;
            this._isFetchingStatistics = true;

            return this._statisticsService.getDatasources().then(function(datasources) {
                return Object.keys(datasources)
                    .filter(function(x) { return x === self.source; })
                    .sort()
                    .map(function(x) { return datasources[x]; });
            }).then(function(sources) {
                var i, sourceLength, source,
                    j, metricsLength, metric,
                    datasourcesPromises = [];
                for (i = 0, sourceLength = sources.length; i < sourceLength; i++) {
                    source = sources[i];
                    for (j = 0, metricsLength = self.metrics.length; j < metricsLength; j++) {
                        metric = self.metrics[j];
                        if (typeof metric === 'object' && metric && metric.length) {
                            datasourcesPromises.push(self._addDatasourceToChart(source, metric[0], self.removePrefix, metric[1]));
                        } else {
                            datasourcesPromises.push(self._addDatasourceToChart(source, metric, self.removePrefix));
                        }
                    }
                }
                return Promise.all(datasourcesPromises);
            }).then(function() {
                setTimeout(function() {
                    self.chart.finishRendering();
                }, 1000);
                self._isFetchingStatistics = false;
            });
        }
    },

    handleEvent: {
        value: function(event) {
            var key = this._eventToKey[event.type];
            if (key) {
                this.chart.addPoint(key, {
                    x: this._dateToTimestamp(event.detail.timestamp),
                    y: this.transformValue(event.detail.value)
                });
            }
        }
    },

    _dateToTimestamp: {
        value: function(date) {
            return Math.floor((new Date(date.$date).getTime() - this._timezoneOffset) / 1000) * 1000
        }
    }
});
