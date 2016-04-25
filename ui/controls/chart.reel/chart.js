/**
 * @module ui/controls/chart.reel
 */
var Component = require("montage/ui/component").Component,
    nvd3 = require('./nvd3/nv.d3');

/**
 * @class Chart
 * @extends Component
 */
exports.Chart = Component.specialize(/** @lends Chart# */ {
    OPTIONS: {
        value: {
            updatePeriod: {
                defaultValue: 10000,
                minimum: 500
            },
            interpolation: {
                defaultValue: 'linear',
                list: [
                    'linear',
                    'basis',
                    'cardinal'
                ]
            },
            showLegend: {
                defaultValue: false
            },
            showControls: {
                defaultValue: false
            },
            showTotalInTooltip: {
                defaultValue: false
            },
            showXAxis: {
                defaultValue: false
            },
            showYAxis: {
                defaultValue: false
            },
            useGuideline: {
                defaultValue: false
            },
            transitionDuration: {
                defaultValue: 0
            },
            xFormat: {
                defaultValue: ''
            },
            yFormat: {
                defaultValue: '%'
            },
            showMinMax: {
                defaultValue: false
            },
            isTimeSeries: {
                defaultValue: false
            }
        }
    },

    _xFormatter: {
        value: null
    },

    _updateInterval: {
        value: null
    },

    _chart: {
        value: null
    },

    _series: {
        value: null
    },

    series: {
        get: function() {
            return this._series;
        },
        set: function(series) {
            if (this._series != series) {
                var self = this,
                    i, length;
                if (series) {
                    self._series = [];
                    for (i = 0, length = series.length; i < length; i++) {
                        self.addSerie(series[i]);
                    }
                }
            }
        }
    },

    constructor: {
        value: function() {
            var self = this;
            nvd3.addGraph(function() {
                self._createChart();
                self._formatYAxis();
                self._formatXAxis();
                self._series = [];
            });
        }
    },

    addSerie: {
        value: function(serie) {
            var existingSerieIndex = this._series.map(function(x) { return x.key === serie.key; }).indexOf(true);
            if (existingSerieIndex > -1) {
                this._series.splice(existingSerieIndex, 1, serie);
            } else {
                this._series.push(serie);
            }
            this.needsDraw = true;
        }
    },

    draw: {
        value: function() {
            if (this._series && this._series.length > 0) {
                d3.select(this.chartElement)
                    .datum(this._series)
                    .call(this._chart);
            }
        }
    },

    refresh: {
        value: function() {
            d3.select(this.chartElement)
                .datum(this._series)
                .transition().ease('quad')
                .call(this._chart);
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            nv.utils.windowResize(function(){
                self._chart.update();
            });

        }
    },

    _createChart: {
        value: function () {
            if (this._getOptionValue('isStacked')) {
                this._chart = nv.models.stackedAreaChart();
            } else {
                this._chart = nv.models.lineChart();
            }
            this._chart.options({
                    showLegend: this._getOptionValue('showLegend'),
                    showControls: this._getOptionValue('showControls'),
                    showTotalInTooltip: this._getOptionValue('showTotalInTooltip'),
                    showXAxis: this._getOptionValue('showXAxis'),
                    showYAxis: this._getOptionValue('showYAxis'),
                    useInteractiveGuideline: this._getOptionValue('useGuideline')
                })
                .interpolate(this._getOptionValue('interpolation'))
                .duration(this._getOptionValue('transitionDuration'))
                .useVoronoi(false);
            //this._chart.interactive(false);
        }
    },

    _formatYAxis: {
        value: function () {
            this._chart.yAxis
                .tickFormat(d3.format(this._getOptionValue('yFormat')))
                .showMaxMin(this._getOptionValue('showMinMax'))
                .staggerLabels(true);
        }
    },

    _formatXAxis: {
        value: function () {
            var self = this,
                xFormatter = this._getOptionValue('isTimeSeries') ? function (d) { return d3.time.format(self._getOptionValue('xFormat'))(new Date(d)); } : d3.format(this._getOptionValue('xFormat'));
            this._chart.xAxis
                .tickFormat(xFormatter)
                .showMaxMin(this._getOptionValue('showMinMax'))
                .staggerLabels(true);
        }
    },

    _getOptionValue: {
        value: function(optionName) {
            var optionDefinition = this.OPTIONS[optionName],
                realValue = this[optionName];
            if (optionDefinition) {
                var minimum = optionDefinition.minimum,
                    maximum = optionDefinition.maximum,
                    list = optionDefinition.list;
                if (typeof realValue == 'undefined' || (typeof realValue == 'object' && !realValue)) {
                    realValue = optionDefinition.defaultValue;
                } else {
                    if (typeof minimum != 'undefined') {
                        realValue = Math.max(realValue, minimum);
                    }
                    if (typeof maximum != 'undefined') {
                        realValue = Math.min(realValue, maximum);
                    }
                    if (typeof list != 'undefined') {
                        if (list.indexOf(realValue) == -1) {
                            realValue = optionDefinition.defaultValue;
                        }
                    }
                }
            }
            return realValue;
        }
    }
});
