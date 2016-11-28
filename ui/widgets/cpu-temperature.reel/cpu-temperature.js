/**
 * @module ui/cpu-temperature.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class CpuTemperature
 * @extends Component
 */
exports.CpuTemperature = Component.specialize(/** @lends CpuTemperature# */ {

    _cpus: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            if (isFirstTime) {
                return this.application.systemInfoService.getHardware().then(function(hardware) {
                    var cpus = [];
                    for (var i = 0; i < hardware.cpu_cores; i++) {
                        cpus.push('cputemp-' + i);
                    }
                    self._cpus = cpus;
                });
            }
        }
    },

    transformValue: {
        value: function(value) {
            return isNaN(value) || value < 0 ? 0 : (value - 2732) / 10;
        }
    },

    getChartLabel: {
        value: function(source, metric, suffix, isTimeSeries) {
            return source.label.replace('temp', '');
        }
    }
});
