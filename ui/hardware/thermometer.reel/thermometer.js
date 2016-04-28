var Component = require("montage/ui/component").Component;

/**
 * @class Thermometer
 * @extends Component
 */
exports.Thermometer = Component.specialize({
    _cpu_temp_stats: {
        value: [
            {
                "normalized_value": 35,
                "alerts": {
                    "normalized_alert_high": null,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": true,
                    "alert_low": null
                },
                "name": "localhost.cputemp-7.temperature.value",
                "last_value": 3082,
                "short_name": "cpu_7_temperature",
                "unit": "C"
            },
            {
                "normalized_value": 39,
                "alerts": {
                    "normalized_alert_high": true,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": null,
                    "alert_low": null
                },
                "name": "localhost.cputemp-3.temperature.value",
                "last_value": 3122,
                "short_name": "cpu_3_temperature",
                "unit": "C"
            },
            {
                "normalized_value": 35,
                "alerts": {
                    "normalized_alert_high": null,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": true,
                    "alert_low": null
                },
                "name": "localhost.cputemp-6.temperature.value",
                "last_value": 3082,
                "short_name": "cpu_6_temperature",
                "unit": "C"
            },
            {
                "normalized_value": 35,
                "alerts": {
                    "normalized_alert_high": null,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": true,
                    "alert_low": null
                },
                "name": "localhost.cputemp-0.temperature.value",
                "last_value": 3082,
                "short_name": "cpu_0_temperature",
                "unit": "C"
            },
            {
                "normalized_value": 39,
                "alerts": {
                    "normalized_alert_high": true,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": null,
                    "alert_low": null
                },
                "name": "localhost.cputemp-2.temperature.value",
                "last_value": 3122,
                "short_name": "cpu_2_temperature",
                "unit": "C"
            },
            {
                "normalized_value": 35,
                "alerts": {
                    "normalized_alert_high": null,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": true,
                    "alert_low": null
                },
                "name": "localhost.cputemp-1.temperature.value",
                "last_value": 3082,
                "short_name": "cpu_1_temperature",
                "unit": "C"
            },
            {
                "normalized_value": 33,
                "alerts": {
                    "normalized_alert_high": null,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": null,
                    "alert_low": null
                },
                "name": "localhost.cputemp-5.temperature.value",
                "last_value": 3062,
                "short_name": "cpu_5_temperature",
                "unit": "C"
            },
            {
                "normalized_value": 34,
                "alerts": {
                    "normalized_alert_high": null,
                    "alert_high": null,
                    "alert_high_enabled": false,
                    "alert_low_enabled": false,
                    "normalized_alert_low": null,
                    "alert_low": null
                },
                "name": "localhost.cputemp-4.temperature.value",
                "last_value": 3072,
                "short_name": "cpu_4_temperature",
                "unit": "C"
            }
        ]
    },

    cpu_temp_stats: {
        get: function() {
            return this._cpu_temp_stats;
        }
    }
});
