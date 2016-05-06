var Montage = require("montage").Montage,
    BackEndBridgeModule = require("../backend/backend-bridge");

var StatisticsService = exports.StatisticsService = Montage.specialize({
    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    _datasources: {
        value: null
    },

    constructor: {
        value: function() {
            this._datasources = {};
        }
    },

    getDatasources: {
        value: function(hostname) {
            hostname = hostname || 'localhost';
            if (!this._datasources[hostname]) {
                this._datasources[hostname] = this._callBackend("stat.get_data_sources_tree", []).then(function(response) {
                    return response.data.children[hostname].children;
                });
            }
            return this._datasources[hostname];
        }
    },

    getDatasourceHistory: {
        value: function(datasource, startDate, endDate, periodInSecs) {
            periodInSecs = periodInSecs || 10;
            endDate = endDate || new Date();
            startDate = startDate || new Date(endDate.getTime() - (periodInSecs * 100 * 1000));
            return this._callBackend("stat.get_stats", [datasource, {
                start:  {"$date": startDate.toISOString()},
                end:    {"$date": endDate.toISOString()},
                frequency:  periodInSecs + 's'
            }]).then(function(response) {
                return response.data.data;
            });
        }
    },

    subscribeToUpdates: {
        value: function(datasource, listener) {
            return this._backendBridge.subscribeToEvent("statd." + datasource, listener);
        }
    },

    unSubscribeToUpdates: {
        value: function(datasource, listener) {
            return this._backendBridge.unSubscribeToEvent("statd." + datasource, listener);
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
