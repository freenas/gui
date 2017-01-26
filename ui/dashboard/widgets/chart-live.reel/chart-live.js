var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    _ = require('lodash');

/**
 * @class ChartLive
 * @extends Component
 */
exports.ChartLive = Component.specialize({
    datasources: {
        value: null
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
        value: function (isFirstTime) {
            if (isFirstTime) {
                // _initializeData will be called by _handleDatasourcesChange
                this.addRangeAtPathChangeListener('datasources', this, '_handleDatasourcesChange');
            }
        }
    },

    transformValue: {
        value: function(value) {
            if (typeof this.parentComponent.transformValue === 'function') {
                return this.parentComponent.transformValue(+value);
            }
            return this.callDelegateMethod('transformValue', +value) ||
                (value && !isNaN(value) ? +value : 0);
        }
    },

    getChartKey: {
        value: function(source, metric, suffix) {
            return this.callDelegateMethod('getChartKey', source, metric, suffix, this.isTimeSeries);
        }
    },

    getChartLabel: {
        value: function(source, metric, suffix) {
            return this.callDelegateMethod('getChartLabel', source, metric, suffix, this.isTimeSeries);
        }
    },

    _defaultLabelSorter: {
        value: function(a, b) {
            var strA = a.replace(/\d+$/, ''),
                strB = b.replace(/\d+$/, '');

            if (strA === strB) {
                return +(a.replace(strA, '')) - +(b.replace(strB, ''));
            }
            return Object.compare(a, b);
        }
    },

    _getChartLabelSorter: {
        value: function() {
            if (this.isTimeSeries) {
                return undefined;
            } else if (this.delegate && typeof this.delegate.labelSorter === 'function') {
                return this.delegate.labelSorter;
            }
            return this._defaultLabelSorter;
        }
    },

    _handleDatasourcesChange: {
        value: function () {
            //todo save the promise instead.
            this.chart.isSpinnerShown = true;
            this._isFetchingStatistics = false;
            this._initializeData();
        }
    },

    _unsubscribeAllUpdates: {
        value: function() {
            if (this._subscribedUpdates) {
                this._statisticsService.unsubscribeToDatasourcesUpdates(this._subscribedUpdates, this);
                this._subscribedUpdates = null;
            }
        }
    },

    _initializeData: {
        value: function () {
            if (!this._isFetchingStatistics && this.datasources && this.datasources.length > 0) {
                this._unsubscribeAllUpdates();
                this._eventToKey = {};
                this._eventToSource = {};
                this._subscribedUpdates = [];
                this._fetchStatistics();
            }
        }
    },

    _getTimeseriesDatasourceProperties: {
        value: function(source, metric, prefix, suffix) {
            var suffixSafe = suffix || 'value',
                path = source.children[metric].path.join('.') + '.' + suffixSafe,
                key  = this.getChartKey(source, metric, suffixSafe) ||
                        [
                            this.datasources.length > 1 ? source.label : '',
                            metric,
                            suffix || ''
                        ]
                            .filter(function(x) { return x.length; })
                            .join('.')
                            .replace(prefix, ''),
                event = path + '.pulse',
                label = this.getChartLabel(source, metric, suffixSafe);

            return {
                path:  path,
                key:   key,
                event: event,
                label: label,
                disabled: this.disabledMetrics && this.disabledMetrics.indexOf(metric) != -1
            };
        }
    },

    _getSnapshotDatasourceProperties: {
        value: function(source, metric, prefix, suffix) {
            var suffixSafe = suffix || 'value',
                path = source.children[metric].path.join('.') + '.' + suffixSafe,
                key  = this.getChartKey(source, metric, suffixSafe) ||
                        [
                            metric,
                            suffix || ''
                        ]
                            .filter(function(x) { return x.length; })
                            .join('.')
                            .replace(prefix, ''),
                event = path + '.pulse',
                label = this.getChartLabel(source, metric, suffixSafe) ||
                        (this.removeSourcePrefix ? source.label.replace(this.removeSourcePrefix, "") : source.label);

            return {
                path:  path,
                key:   key,
                event: event,
                label: label
            };
        }
    },

    _getDatasourceProperties: {
        value: function(source, metric, prefix, suffix) {
            if (this.isTimeSeries) {
                return this._getTimeseriesDatasourceProperties(source, metric, prefix, suffix);
            } else {
                return this._getSnapshotDatasourceProperties(source, metric, prefix, suffix);
            }
        }
    },

    _setupTimeseriesDatasources: {
        value: function(datasourceProperties) {
            var self = this,
                allPathes = datasourceProperties.map(function(prop) { return prop.path; }),
                allEvents = datasourceProperties.map(function(prop) { return prop.event; }),
                startTimestamp = Math.ceil(Date.now() / self.constructor.TIME_SERIES_INTERVAL - 100) * self.constructor.TIME_SERIES_INTERVAL,
                property, eventType, i;

            return this._statisticsService.getDatasourcesHistory(allPathes).then(function (values) {
                for (i = 0; i < datasourceProperties.length; i++) {
                    property = datasourceProperties[i];
                    self.chart.addSeries({
                        key: property.key,
                        disabled: property.disabled,
                        values: values.map(function (value, index) {
                            return {
                                x: property.label || (startTimestamp + index * self.constructor.TIME_SERIES_INTERVAL),
                                y: self.transformValue(value[i])
                            }
                        })
                    });
                }
            }).then(function() {
                return self._statisticsService.subscribeToDatasourcesUpdates(allEvents, self).then(function() {
                    for (i = 0; i < datasourceProperties.length; i++) {
                        property = datasourceProperties[i];
                        // FIXME: backend bridge _addEventListeners should return 
                        // event & eventType key-value pairs, rather than an array of eventTypes
                        eventType = 'statd.' + property.event;
                        self._eventToKey[eventType] = property.key;
                    }
                    self._subscribedUpdates = self._subscribedUpdates.concat(allEvents);
                });
            });
        }
    },

    _setupSnapshotDatasources: {
        value: function(datasourceProperties) {
            var self = this,
                allPathes = datasourceProperties.map(function(prop) { return prop.path; }),
                allEvents = datasourceProperties.map(function(prop) { return prop.event; }),
                property, eventType, i;

            return this._statisticsService.getDatasourcesCurrentValue(allPathes).then(function(values) {
                for (i = 0; i < datasourceProperties.length; i++) {
                    property = datasourceProperties[i];
                    self.chart.setValue(property.key, {
                        x: property.label,
                        y: self.transformValue(values[0][i])
                    });
                }
            }).then(function() {
                return self._statisticsService.subscribeToDatasourcesUpdates(allEvents, self).then(function() {
                    for (i = 0; i < datasourceProperties.length; i++) {
                        property = datasourceProperties[i];
                        // FIXME: backend bridge _addEventListeners should return 
                        // event & eventType key-value pairs, rather than an array of eventTypes
                        eventType = 'statd.' + property.event;
                        self._eventToKey[eventType] = property.key;
                        self._eventToSource[eventType] = property.label;
                    }
                    self._subscribedUpdates = self._subscribedUpdates.concat(allEvents);
                });
            });
        }
    },

    _setupDatasources: {
        value: function(datasourceProperties) {
            if (this.isTimeSeries) {
                return this._setupTimeseriesDatasources(datasourceProperties);
            } else {
                return this._setupSnapshotDatasources(datasourceProperties);
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
                    .sort(self._getChartLabelSorter())
                    .map(function(x) { return datasources[x]; });
            }).then(function(datasources) {
                var i, sourceLength, source,
                    j, metricsLength, metric,
                    datasourceProperties = [];
                for (i = 0, sourceLength = datasources.length; i < sourceLength; i++) {
                    source = datasources[i];
                    for (j = 0, metricsLength = self.metrics.length; j < metricsLength; j++) {
                        metric = self.metrics[j];
                        if (typeof metric === 'object' && metric && metric.length) {
                            datasourceProperties.push(self._getDatasourceProperties(source, metric[0], self.removePrefix, metric[1]));
                        } else {
                            datasourceProperties.push(self._getDatasourceProperties(source, metric, self.removePrefix));
                        }
                    }
                }
                return self._setupDatasources(datasourceProperties);
            }).then(function() {
                setTimeout(function() {
                    self.chart.finishRendering();
                    self.chart.needsDraw = true;
                }, 750);

                self._isFetchingStatistics = false;
            });
        }
    },

    handleEvent: {
        value: function(event) {
            var key = this._eventToKey[event.name];
            if (key) {
                if (this.isTimeSeries) {
                    this._addPointToChart(key, {
                        x: this._dateToTimestamp(event.args.timestamp),
                        y: this.transformValue(event.args.value)
                    });
                } else {
                    this.chart.setValue(key, {
                        x: this._eventToSource[event.name],
                        y: this.transformValue(event.args.value)
                    });
                }
            }
        }
    },

    _addPointToChart: {
        value: function(key, point) {
            var numKeys = Object.keys(this._eventToKey).length,
                avgTime, series;

            this._pointsCache = this._pointsCache || {};
            this._pointsCache[key] = point;

            if (Object.keys(this._pointsCache).length === numKeys) {
                avgTime = _.sum(_.map(this._pointsCache, 'x')) / numKeys;
                avgTime = Math.floor(avgTime / this.constructor.TIME_SERIES_INTERVAL) * this.constructor.TIME_SERIES_INTERVAL;
                for (series in this._pointsCache) {
                    this.chart.addPoint(series, {
                        x: avgTime,
                        y: this._pointsCache[series].y
                    });
                }
                this._pointsCache = null;
            }
        }
    },

    _dateToTimestamp: {
        value: function(date) {
            return new Date(date.$date).getTime() - this._timezoneOffset;
        }
    }

}, {
    TIME_SERIES_INTERVAL: {
        value: 10 * 1000
    }
});
