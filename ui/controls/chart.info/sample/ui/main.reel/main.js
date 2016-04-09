/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({
    series: {
        value: null
    },

    updateInterval: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                sampleFrequency = 500;
            if (isFirstTime) {
                var series1 = [
                    {
                        values: [],
                        key: 'Foo1',
                        color: "#ff0000"
                    },
                    {
                        values: [],
                        key: 'Bar1',
                        color: "#00ff00"
                    }
                ];
                var lastPoint = Date.now() - (100 * sampleFrequency);
                while (series1[0].values.length < 100) {
                    series1[0].values.push({x: lastPoint, y: Math.random()});
                    series1[1].values.push({x: lastPoint + Math.random()*10, y: Math.random()});
                    lastPoint += sampleFrequency;
                }
                this.updateInterval1 = setInterval(function() {
                    self.series1[0].values.push({x: Date.now(), y: Math.random()});
                    self.series1[1].values.push({x: Date.now() + Math.random()*10, y: Math.random()});
                    if (self.series1[0].values.length > 100) {
                        self.series1[0].values.shift();
                        self.series1[1].values.shift();
                    }
                }, sampleFrequency);
                this.series1 = series1;


                var series2 = [
                    {
                        values: [],
                        key: 'Foo2',
                        color: "#3f0000"
                    },
                    {
                        values: [],
                        key: 'Bar2',
                        color: "#003f00"
                    }
                ];
                lastPoint = Date.now() - (100 * sampleFrequency/2);
                while (series2[0].values.length < 100) {
                    series2[0].values.push({x: lastPoint, y: Math.random()});
                    series2[1].values.push({x: lastPoint + Math.random()*10, y: Math.random()});
                    lastPoint += sampleFrequency/2;
                }
                this.series2 = series2;

                this.updateInterval2 = setInterval(function() {
                    self.series2[0].values.push({x: Date.now(), y: Math.random()});
                    self.series2[1].values.push({x: Date.now() + Math.random()*10, y: Math.random()});
                    if (self.series2[0].values.length > 100) {
                        self.series2[0].values.shift();
                        self.series2[1].values.shift();
                    }
                }, sampleFrequency/2);
            }
        }
    },

    exitDocument: {
        value: function() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval1);
                clearInterval(this.updateInterval2);
                this.updateInterval1 = null;
                this.updateInterval2 = null;
            }
        }
    }
});
