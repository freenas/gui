var Component = require("montage/ui/component").Component;

/**
 * @class NetworkTraffic
 * @extends Component
 */
exports.NetworkTraffic = Component.specialize({
    _updateInterval: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.series = this._generateFakeData();
            }
        }
    },

    exitDocument: {
        value: function () {
            clearInterval(this._updateInterval);
        }
    },

    _generateFakeData: {
        value: function() {
            //var self = this;
            var sampleFrequency = 2000,
                sampleCount = 50,
                series = [
                    {
                        values: [],
                        key: 'em0 UP',
                        //color: "#ff0000"
                    },
                    {
                        values: [],
                        key: 'em0 DOWN',
                        //color: "#00ff00"
                    }
                ],
                x = Date.now() - (sampleCount * sampleFrequency);

            while (series[0].values.length < sampleCount) {
                series[0].values.push({x: x, y: Math.random()*(1024*1024)});
                series[1].values.push({x: x, y: Math.random()*(1024*1024)});
                x += sampleFrequency;
            }

            this.updateInterval1 = setInterval(function() {
                series[0].values.push({x: Date.now(), y: Math.random()*(1024*1024)});
                series[1].values.push({x: Date.now(), y: Math.random()*(1024*1024)});
                if (series[0].values.length > sampleCount) {
                    series[0].values.shift();
                    series[1].values.shift();
                }
                //self.series = series.map(function(x) {x.values = x.values.slice(100); return x });
            }, sampleFrequency);
            return series;
        }
    }
});
