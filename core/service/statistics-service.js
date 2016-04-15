var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var StatisticsService = exports.StatisticsService = Montage.specialize({
    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getDatasources: {
        value: function(hostname) {
            hostname = hostname || 'localhost';
            return this._callBackend("statd.output.get_data_sources_tree", []).then(function(response) {
                return response.data.children[hostname].children;
            });
        }
    },

    getDatasourceHistory: {
        value: function(datasource, startDate, endDate, periodInSecs) {
            periodInSecs = periodInSecs || 10;
            endDate = endDate || new Date();
            startDate = startDate || new Date(endDate.getTime() - (periodInSecs * 100 * 1000));
            return this._callBackend("statd.output.query", [datasource, {
                start:  startDate.toISOString(),
                end:    endDate.toISOString(),
                frequency:  periodInSecs + 's'
            }]).then(function(response) {
                return response.data.data;
            });
        }
    },

    _callBackend: {
        value: function(method, args) {
            return this._backendBridge.send("rpc", "call", {
                method: method,
                args: args
            });
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new StatisticsService();
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
