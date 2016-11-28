var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class ChartLive
 * @extends Component
 */
exports.ChartLive = Component.specialize({
    _datasources: {
        value: null
    },

    datasources: {
        get: function() {
            return this._datasources;
        },
        set: function(datasources) {
            if (this._datasources != datasources) {
                this._datasources = datasources;
                if (typeof this._cancelDatasourcesChange == "function") {
                    this._cancelDatasourcesChange();
                }
                this._cancelDatasourcesChange = this.addRangeAtPathChangeListener('datasources', this, '_handleDatasourcesChange');
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
        value: function() {
            this._initializeData();
        }
    },

    exitDocument: {
        value: function() {
            this._unsubscribeAllUpdates();
            if (typeof this._cancelDatasourcesChange == "function") {
                this._cancelDatasourcesChange();
            }
        }
    },

    transformValue: {
        value: function(value) {
            if (typeof this.parentComponent.transformValue === 'function') {
                return this.parentComponent.transformValue(value);
            }
            return this.callDelegateMethod('transformValue', value) || value;
        }
    },

    getChartKey: {
        value: function(source, metric, suffix, isTimeSeries) {
            if (this.delegate && typeof this.delegate.getChartKey === 'function') {
                return this.delegate.getChartKey.apply(this.delegate, arguments);
            }
            return null;
        }
    },

    getChartLabel: {
        value: function(source, metric, suffix, isTimeSeries) {
            if (this.delegate && typeof this.delegate.getChartLabel === 'function') {
                return this.delegate.getChartLabel.apply(this.delegate, arguments);
            }
            return null;
        }
    },

    _handleDatasourcesChange: {
        value: function() {
            this._initializeData();
        }
    },

    _unsubscribeAllUpdates: {
        value: function() {
            var i, length;
            if (this._subscribedUpdates) {
                for (i = 0, length = this._subscribedUpdates.length; i < length; i++) {
                    this._statisticsService.unSubscribeToUpdates(this._subscribedUpdates[i]);
                }
            }
        }
    },

    _initializeData: {
        value: function() {
            if (!this._isFetchingStatistics && 
                    this._datasources && 
                    this._datasources.filter(function(x) { return !!x }).length > 0) {
                this._unsubscribeAllUpdates();
                this._eventToKey = {};
                this._eventToSource = {};
                this._subscribedUpdates = [];
                this._fetchStatistics();
            }
        }
    },

    _addSnapshotDatasourceToChart: {
        value: function (source, metric, prefix, suffix) {
            var hasSuffix = !!suffix;
            suffix = suffix || 'value';
            var self = this,
                path = source.children[metric].path.join('.') + '.' + suffix,
                key  = this.getChartKey(source, metric, suffix) ||
                        [
                            metric,
                            hasSuffix ? suffix : ''
                        ]
                            .filter(function(x) { return x.length; })
                            .join('.')
                            .replace(prefix, ''),
                event = path + '.pulse',
                label = this.getChartLabel(source, metric, suffix) ||
                        (self.removeSourcePrefix ? source.label.replace(self.removeSourcePrefix, "") : source.label);

            return self._statisticsService.getDatasourceCurrentValue(path).then(function (value) {
                var currentValue = value ?  +value[1] : 0;
                return self.chart.setValue(key, {
                    x: label,
                    y: self.transformValue(currentValue)
                });
            }).then(function() {
                if (self._inDocument) {
                    return self._statisticsService.subscribeToUpdates(event, self).then(function(eventType) {
                        self._eventToKey[eventType] = key;
                        self._eventToSource[eventType] = label;
                        self._subscribedUpdates.push(event);
           });
                } else {
                    return false;
                }
            });

        }
    },

    _addTimeseriesDatasourceToChart: {
        value: function (source, metric, prefix, suffix) {
            var hasSuffix = !!suffix;
            suffix = suffix || 'value';
            var self = this,
                path = source.children[metric].path.join('.') + '.' + suffix,
                key  = this.getChartKey(source, metric, suffix, true) ||
                        [
                            this._datasources.length > 1 ? source.label : '',
                            metric,
                            hasSuffix ? suffix : ''
                        ]
                            .filter(function(x) { return x.length; })
                            .join('.')
                            .replace(prefix, ''),
                series = {
                    key: key
                },
                event = path + '.pulse';

            return self._statisticsService.getDatasourceHistory(path).then(function (values) {
                series.values = values.map(function (value) {
                        return {
                            x: self.getChartLabel(source, metric, suffix, true) || self._dateToTimestamp(value[0]),
                            y: self.transformValue(+value[1])
                        }
                    });
                series.disabled = self.disabledMetrics && self.disabledMetrics.indexOf(metric) != -1;
                return self.chart.addSeries(series);
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

    _addDatasourceToChart: {
        value: function(source, metric, prefix, suffix) {
            if (this.isTimeSeries) {
                return this._addTimeseriesDatasourceToChart(source, metric, prefix, suffix);
            } else {
                return this._addSnapshotDatasourceToChart(source, metric, prefix, suffix);
            }
        }
    },

    _fetchStatistics: {
        value: function() {
            var self = this;
            this._isFetchingStatistics = true;

            return this._statisticsService.getDatasources().then(function(datasources) {
                return Object.keys(datasources)
                    .filter(function(x) { return self.datasources.indexOf(x) != -1; })
                    .sort()
                    .map(function(x) { return datasources[x]; });
            }).then(function(datasources) {
                var i, sourceLength, source,
                    j, metricsLength, metric,
                    datasourcesPromises = [];
                for (i = 0, sourceLength = datasources.length; i < sourceLength; i++) {
                    source = datasources[i];
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
                    self.chart.needsDraw = true;
                }, 1000);

                self._isFetchingStatistics = false;
            });
        }
    },

    handleEvent: {
        value: function(event) {
            var key = this._eventToKey[event.type];
            if (key) {
                if (this.isTimeSeries) {
                    this.chart.addPoint(key, {
                        x: this._dateToTimestamp(event.detail.timestamp),
                        y: this.transformValue(event.detail.value)
                    });
                } else {
                    this.chart.setValue(key, {
                        x: this._eventToSource[event.type],
                        y: this.transformValue(event.detail.value)
                    });
                }
            }
        }
    },

    _dateToTimestamp: {
        value: function(date) {
            return Math.floor((new Date(date.$date).getTime() - this._timezoneOffset) / 1000) * 1000
        }
    }

});
