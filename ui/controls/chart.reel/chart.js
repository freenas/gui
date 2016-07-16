/**
 * @module ui/controls/chart.reel
 */
var Component = require("montage/ui/component").Component,
    Plottable = window.Plottable;

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
            xLabel: {
                defaultValue: null
            },
            yLabel: {
                defaultValue: null
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

    _datasets: {
        value: null
    },

    _seriesList: {
        value: null
    },
    
    constructor: {
        value: function() {
            this._datasets = {};
            this._seriesList = [];
        }
    },

    addSerie: {
        value: function(series) {
            this._seriesList.push(series);
            this._plot.addDataset(this._seriesToDataset(series));
            this._colorScale.domain(this._colorScale.domain().concat([series.key]));
            this.needsDraw = true;
        }
    },

    draw: {
        value: function() {
            var datasets = this._plot.datasets();
            if (datasets.length > 0) {
                var times = datasets[0].data().map(function(x) { return x.x; }),
                    dataset, metadata;
                this._xScale.domain([
                    times[0],
                    times.slice(-1)[0]
                ]);

                this._addDisplayedSeries();
                this._chart.renderImmediately();
                this._plot.renderImmediately();
            }
            this._chart.redraw();
            this._plot.redraw();
        }
    },

    addPoint: {
        value: function(key, point) {
            var series = this._seriesList.filter(function(x) { return x.key === key; })[0];
            if (series) {
                var points = series.values;
                if (points.slice(-1)[0].x < point.x) {
                    point.name = series.key;
                    points.shift();
                    points.push(point);
                    this._datasets[key] = this._seriesToDataset(series);
                    this._refresh();
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            this.isSpinnerShown = true;
            if (isFirstTime) {
                this._setupX();
                this._setupY();
                this._setupLegend();
                var graphGroup = this._setupPlot();
                this._setupChart(graphGroup);
                this._setupInteraction();
            }
        }
    },

    exitDocument: {
        value: function () {
            this._plot.datasets([]);
            this._seriesList = [];
            this._datasets = {};
            window.removeEventListener("resize", this._redrawChart.bind(this));
        }
    },

    _addDisplayedSeries: {
        value: function() {
            var legendsContainer = this._legend.content()[0][0],
                legendElements = legendsContainer.getElementsByClassName('legend-entry'),
                disabledSeries = this._seriesList.filter(function(x) { return x.disabled; }).map(function(x) { return x.key; }),
                legendElement, series,
                datasets = [],
                i, length;
            for (i = 0, length = legendElements.length; i < length; i++) {
                legendElement = legendElements.item(i);
                if (disabledSeries.length > 0 && disabledSeries.indexOf(d3.select(legendElement).datum()) != -1) {
                    legendElement.classList.add('is-disabled');
                } else {
                    legendElement.classList.remove('is-disabled');
                }
            }
            for (i = 0, length = this._seriesList.length; i < length; i++) {
                series = this._seriesList[i];
                if (!series.disabled) {
                    datasets.push(this._seriesToDataset(series));        
                }
            }
            this._plot.datasets(datasets);
        }
    },

    _setupX: {
        value: function() {
            this._xScale = new Plottable.Scales.Linear();
            this._xAxis = new Plottable.Axes.Numeric(this._xScale, "bottom")
                .addClass('is-label-hidden')
                .formatter(function(d) {
                    return '';
                });
        }
    },

    _setupY: {
        value: function() {
            this._yScale = new Plottable.Scales.Linear().domainMin(0);
            this._yAxis = new Plottable.Axes.Numeric(this._yScale, "left")
                .formatter(new Plottable.Formatters.siSuffix(2));
        }
    },

    _setupLegend: {
        value: function() {
            this._colorScale = new Plottable.Scales.Color('20');
            this._legend = new Plottable.Components.Legend(this._colorScale);
            this._legend.maxEntriesPerRow(Infinity);
        }
    },

    _setupPlot: {
        value: function() {
            this._plot = this._getPlotComponent();
            this._plot.x(function(d) { return d.x; }, this._xScale)
                .y(function(d) { return d.y; }, this._yScale)
                .attr("fill", function(d) { return d.name; }, this._colorScale)
                .attr("stroke", function(d) { return d.name; }, this._colorScale);

            return graphGroup = new Plottable.Components.Group([this._plot, this._legend]);
        }
    },

    _setupChart: {
        value: function(graphGroup) {
            this._chart = new Plottable.Components.Table([
                [this._yAxis, graphGroup],
                [null, this._xAxis]
            ]);
            var gridline = new Plottable.Components.Gridlines(null, this._yScale);
            
            this._chart.renderTo(d3.select(this.chartElement));
            gridline.renderTo(d3.select(this.chartElement));
            window.addEventListener("resize", this._redrawChart.bind(this));
        }
    },

    _setupInteraction: {
        value: function() {
            var self = this;
            new Plottable.Interactions.Click()
                .attachTo(this._legend)
                .onClick(function(p) {
                    var entity = self._legend.entitiesAt(p)[0];
                    if (entity !== undefined) {
                        var series = self._seriesList.filter(function(x) { return x.key === entity.datum; })[0];
                        if (series) {
                            series.disabled = !series.disabled;
                            self.needsDraw = true;
                        }
                    }
                });
        }
    },

    _refresh: {
        value: function() {
            var series, key, metadata,
                i, length;
            if (this._seriesList.length <= Object.keys(this._datasets).length) {
                var datasets = [];
                this._alignEventsTime();
                for (i = 0, length = this._seriesList.length; i < length; i++) {
                    series = this._seriesList[i];
                    key = series.key;
                    if (!series.disabled && this._datasets[key]) {
                        datasets.push(this._datasets[key]);
                    }
                }
                this._datasets = {};
                this._plot.datasets(datasets);
                this.needsDraw = true;
            }
        }
    },

    _alignEventsTime: {
        value: function() {
            var keys = Object.keys(this._datasets),
                firstDataset = this._datasets[keys[0]],
                key, dataset, time, values,
                differentLastTimes = [],
                i, length;
            if (keys.length > 0) {
                for (var j = 0, pointsLength = firstDataset.length; j < pointsLength; j++) {
                    for (i = 0, length = keys.length; i < length; i++) {
                        key = keys[i];
                        dataset = this._datasets[key];
                        values = dataset.data();
                        time = values[j].x;
                        if (differentLastTimes.indexOf(time) == -1) {
                            differentLastTimes.push(time);
                        }
                    }
                    if (differentLastTimes.length > 1) {
                        var max = Math.max.apply(null, differentLastTimes);
                        for (i = 0, length = keys.length; i < length; i++) {
                            key = keys[i];
                            dataset = this._datasets[key];
                            values = dataset.data();
                            values[j].x = max;
                        } 
                    }
                }
            }
        }
    },

    _getPlotComponent: {
        value: function() {
            switch (this.graphType) {
                case 'stacked':
                    return new Plottable.Plots.StackedArea();
                case 'line':
                default:
                    return new Plottable.Plots.Line();
            }
        }
    },

    _redrawChart: {
        value: function() {
            this._chart.redraw();
        }
    },

    _seriesToDataset: {
        value: function(series) {
            return new Plottable.Dataset(
                series.values.map(function(x) {
                    x.name = series.key;
                    return x;
                }), {
                key:        series.key,
                disabled:   series.disabled
            });
        }
    },

    _clearHandleWindowResize:{
        value: null
    },

    finishRendering: {
        value: function() {
            if (this.isSpinnerShown) {
                this.isSpinnerShown = false;
            }
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
            if (this._getOptionValue('yLabel')) {
                this._chart.yAxis.axisLabel(this._getOptionValue('yLabel'));
            }
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
            if (this._getOptionValue('xLabel')) {
                this._chart.xAxis.axisLabel(this._getOptionValue('xLabel'));
            }
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
