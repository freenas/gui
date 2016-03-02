var Component = require("montage/ui/component").Component;

/**
 * @class NetworkTraffic
 * @extends Component
 */
exports.NetworkTraffic = Component.specialize({

    _generateRandomData: {
        value: function (min, max, length) {
            var randomData = [],
                i;

            for (i = 0; i < length; i++) {
                randomData.push(Math.random() * (max - min) + min);
            }
            return randomData;
        }
    },

    percentageToString: {
        value: function (percentage) {
            return Math.round(percentage) + "%";
        }
    },

    _updateInterval: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.chart.data.columns = [
                    ["igb0 Down"].concat(this._generateRandomData(0, 40, 31)),
                    ["igb0 Up"].concat(this._generateRandomData(0, 25, 31))
                ];
            }
            this._updateInterval = setInterval(this._updateChart.bind(this), 2000);
        }
    },

    exitDocument: {
        value: function () {
            clearInterval(this._updateInterval);
        }
    },

    _updateChart: {
        value: function () {
            this.chart.flow({
                columns: [
                    ["igb0 Down"].concat(this._generateRandomData(0, 40, 1)),
                    ["igb0 Up"].concat(this._generateRandomData(0, 25, 1))
                ]
            });
        }
    }

});
