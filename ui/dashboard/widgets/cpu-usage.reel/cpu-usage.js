var Component = require("montage/ui/component").Component;

/**
 * @class CpuUsage
 * @extends Component
 */
exports.CpuUsage = Component.specialize({

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
                    ["User"].concat(this._generateRandomData(4, 8, 31)),
                    ["System"].concat(this._generateRandomData(1, 5, 31))
                ];
            }
            //this._updateInterval = setInterval(this._updateChart.bind(this), 2000);
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
                    ["User"].concat(this._generateRandomData(4, 8, 1)),
                    ["System"].concat(this._generateRandomData(1, 5, 1))
                ]
            });
        }
    }

});
