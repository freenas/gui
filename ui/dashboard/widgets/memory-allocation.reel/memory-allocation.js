var Component = require("montage/ui/component").Component,
    bytesConverter = new (require("montage/core/converter/bytes-converter").BytesConverter)();

/**
 * @class MemoryAllocation
 * @extends Component
 */
exports.MemoryAllocation = Component.specialize({

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

    humanize: {
        value: function (value) {
            return bytesConverter.convert(value);
        }
    },

    humanizeRounding: {
        value: function (value) {
            return bytesConverter.convert(value);
        }
    },

    _updateInterval: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            var columns,
                free,
                i, j;

            if (isFirstTime) {
                this.chart.data.columns = [
                    ["Free"],
                    ["Active"].concat(this._generateRandomData(400000000, 500000000, 31)),
                    ["Cache"].concat(this._generateRandomData(2000000, 3000000, 31)),
                    ["Wired"].concat(this._generateRandomData(1100000000, 1300000000, 31)),
                    ["Inactive"].concat(this._generateRandomData(200000000, 250000000, 31))
                ];
                columns = this.chart.data.columns;
                for (i = 1; i < 32; i++) {
                    free = 32768000000;
                    for (j = 1; j < 5; j++) {
                        free -= columns[j][i];
                    }
                    columns[0][i] = free;
                }
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
            var columns = [
                    ["Free"],
                    ["Active"].concat(this._generateRandomData(400000000, 500000000, 1)),
                    ["Cache"].concat(this._generateRandomData(2000000, 3000000, 1)),
                    ["Wired"].concat(this._generateRandomData(1100000000, 1300000000, 1)),
                    ["Inactive"].concat(this._generateRandomData(200000000, 250000000, 1))
                ], j;

            free = 32768000000;
            for (j = 1; j < 5; j++) {
                free -= columns[j][1];
            }
            columns[0][1] = free;
            this.chart.flow({
                columns: columns
            });
        }
    }

});
