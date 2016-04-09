var Component = require("montage/ui/component").Component,
    bytesConverter = new (require("montage/core/converter/bytes-converter").BytesConverter)();

/**
 * @class MemoryAllocation
 * @extends Component
 */
exports.MemoryAllocation = Component.specialize({
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
            var sampleFrequency = 2000,
                sampleCount = 50,
                series = [
                    {
                        values: [],
                        key: 'Free',
                        //color: "#ff0000"
                    },
                    {
                        values: [],
                        key: 'Active',
                        //color: "#0000ff"
                    },
                    {
                        values: [],
                        key: 'Cache',
                        //color: "#ffff00"
                    },
                    {
                        values: [],
                        key: 'Wired',
                        //color: "#00ffff"
                    },
                    {
                        values: [],
                        key: 'Inactive',
                        //color: "#ff00ff"
                    }
                ],
                x = Date.now() - (sampleCount * sampleFrequency);

            while (series[0].values.length < sampleCount) {
                series[0].values.push({x: x, y: Math.random()*(1024*1024*1024*16)});
                series[1].values.push({x: x, y: Math.random()*(1024*1024*1024*8)});
                series[2].values.push({x: x, y: Math.random()*(1024*1024*1024*4)});
                series[3].values.push({x: x, y: Math.random()*(1024*1024*1024*2)});
                series[4].values.push({x: x, y: Math.random()*(1024*1024*1024*1)});
                x += sampleFrequency;
            }

            this.updateInterval1 = setInterval(function() {
                series[0].values.push({x: Date.now(), y: Math.random()*(1024*1024*1024*16)});
                series[1].values.push({x: Date.now(), y: Math.random()*(1024*1024*1024*8)});
                series[2].values.push({x: Date.now(), y: Math.random()*(1024*1024*1024*4)});
                series[3].values.push({x: Date.now(), y: Math.random()*(1024*1024*1024*2)});
                series[4].values.push({x: Date.now(), y: Math.random()*(1024*1024*1024*1)});
                if (series[0].values.length > sampleCount) {
                    series[0].values.shift();
                    series[1].values.shift();
                    series[2].values.shift();
                    series[3].values.shift();
                    series[4].values.shift();
                }
            }, sampleFrequency);
            return series;
        }
    }
});
