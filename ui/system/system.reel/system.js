var Component = require("montage/ui/component").Component;

/**
 * @class System
 * @extends Component
 */
exports.System = Component.specialize({
    _hostname: {
        value: "freenas.local"
    },

    _hardware: {
        value: {
            "cpu_clockrate": 2494,
            "memory_size": 4263260160,
            "cpu_cores": 2,
            "cpu_model": "Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz"
        }
    },

    _loadAvg: {
        value: [
            1.275390625,
            0.7314453125,
            0.634765625
        ]
    },

    _time: {
        value: {
            "uptime": 9006.475831,
            "timezone": "UTC",
            "system_time": "2016-04-14T22:37:41.475739+00:00",
            "boot_time": "2016-04-14T20:07:35+00:00"
        }
    },

    _version: {
        value: "FreeNAS-10-MASTER-201604140930"
    },

    hostname: {
        get: function() {
            return this._hostname;
        }
    },

    hardware: {
        get: function() {
            return this._hardware;
        }
    },

    loadAvg: {
        get: function() {
            var loadAvg = this._loadAvg;
            var loadString = loadAvg[0] + ", " + loadAvg[1] + ", " + loadAvg[2];
            return loadString;
        }
    },

    time: {
        get: function() {
            return this._time;
        }
    },

    version: {
        get: function() {
            return this._version;
        }
    }
});
