/**
 * @module ui/widgets//composite-temperature.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CompositeTemperature
 * @extends Component
 */
exports.CompositeTemperature = Component.specialize(/** @lends CompositeTemperature# */ {

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._statService = this.application.statisticsService;
            }
            this._refreshChart();
            this._startTimer();
        }
    },

    exitDocument: {
        value: function() {
            this._stopTimer();
        }
    },

    _startTimer: {
        value: function(time) {
            var self = this;

            this._stopTimer();
            this._timer = setInterval(this._refreshChart.bind(this), 10000);
        }
    },

    _stopTimer: {
        value: function() {
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = 0;
            }
        }
    },

    _transformValueForType: {
        value: function(value, type) {
            return (isNaN(value) || value < 0) ? 0 :
                (type === 'CPU') ? ((+value - 2732) / 10) : +value;
        }
    },

    _aggregateStatsForType: {
        value: function(stats, type) {
            var count = 0, sum = 0, highest = 0,
                stat, temp, i;

            for (i = stats.length - 1; i >= 0; i--) {
                stat = stats[i];
                if (stat.last_value > 0 && stat.name.includes(type.toLowerCase() + 'temp-')) {
                    count++;
                    temp = this._transformValueForType(stat.last_value, type);
                    sum += temp;
                    highest = Math.max(highest, temp);
                }
            }

            this.chart.setValue('highest', {
                x: type,
                y: highest
            });

            this.chart.setValue('avg', {
                x: type,
                y: count ? sum / count : 0
            });
        }
    },

    _refreshChart: {
        value: function() {
            var self = this;

            this._statService.getTemperatureStats().then(function(stats) {
                self._aggregateStatsForType(stats, 'CPU');
                self._aggregateStatsForType(stats, 'Disk');
                self.chart.finishRendering();
                self.chart.needsDraw = true;
            });
        }
    }
});
