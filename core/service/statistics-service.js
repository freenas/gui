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

    _subscribedUpdates: {
        value: null
    },

    constructor: {
        value: function() {
            this._datasources = {};
            this._subscribedUpdates = [];
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

    getDatasourcesHistory: {
        value: function(datasources, periodInSecs) {
            periodInSecs = periodInSecs || 10;
            return this._callBackend("stat.get_stats", [datasources, {
                timespan:   periodInSecs * 100,
                frequency:  periodInSecs + 's'
            }]).then(function(response) {
                return response.data.data;
            });
        }
    },

    getDatasourcesCurrentValue: {
        value: function(datasources) {
            return this._callBackend("stat.get_stats", [datasources, {
                timespan:   20,
                frequency:  '10s'
            }]).then(function(response) {
                return response.data.data;
            });
        }
    },

    subscribeToDatasourcesUpdates: {
        value: function(datasources, listener) {
            for (var i = datasources.length - 1; i >= 0; i--) {
                if (this._subscribedUpdates.indexOf(datasources[i]) == -1) {
                    this._subscribedUpdates.push(datasources[i]);
                }
            }

            return this._backendBridge.subscribeToEvents(datasources.map(function(datasource) { return "statd." + datasource; }), listener);
        }
    },

    unsubscribeToDatasourcesUpdates: {
        value: function(datasources, listener) {
            for (var i = datasources.length - 1; i >= 0; i--) {
                this._subscribedUpdates.splice(this._subscribedUpdates.indexOf(datasources[i]), 1);
            }

            return this._backendBridge.unSubscribeToEvents(datasources.map(function(datasource) { return "statd." + datasource; }), listener);
        }
    },

    getTemperatureStats: {
        value: function() {
            return this._callBackend("stat.query", [[["name", "~", "temperature"]]]).then(function(response) {
                return response.data;
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
