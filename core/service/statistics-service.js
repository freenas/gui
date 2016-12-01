var Montage = require("montage").Montage,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient;

var StatisticsService = exports.StatisticsService = Montage.specialize({
    _instance: {
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
            this._listeners = new Map();
        }
    },

    getDatasources: {
        value: function(hostname) {
            hostname = hostname || 'localhost';
            if (!this._datasources[hostname]) {
                this._datasources[hostname] = this._callBackend("stat.get_data_sources_tree", []).then(function(response) {
                    return response.children[hostname].children;
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
                timespan:   periodInSecs*100,
                frequency:  periodInSecs + 's'
            }]).then(function(response) {
                return response.data;
            });
        }
    },

    getDatasourceCurrentValue: {
        value: function(datasource) {
            return this._callBackend("stat.get_stats", [datasource, {
                timespan:   20,
                frequency:  '10s'
            }]).then(function(response) {
                return response.data.slice(-1);
            });
        }
    },

    subscribeToUpdates: {
        value: function(datasource, listener) {
            var self = this,
                name = "statd." + datasource;
            if (this._subscribedUpdates.indexOf(datasource) == -1) {
                this._subscribedUpdates.push(datasource);
            }
            return this._middlewareClient.subscribeToEvents(name).then(function() {
                if (!self._listeners.has(name)) {
                    self._listeners.set(name, new Set());
                }
                self._listeners.get(name).add(listener);
                return name;
            });
        }
    },

    unSubscribeToUpdates: {
        value: function(datasource, listener) {
            var name = "statd." + datasource;
            this._subscribedUpdates.splice(this._subscribedUpdates.indexOf(datasource), 1);
            this._listeners.delete(name);
            return this._middlewareClient.unsubscribeFromEvents(name);
        }
    },

    _handleStatsChange: {
        value: function(stats) {
            if (this._listeners.has(stats.name)) {
                this._listeners.get(stats.name).forEach(function(listener) {
                    listener.handleEvent(stats);
                })
            }
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
            return this._middlewareClient.callRpcMethod(method, args);
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new StatisticsService();
                this._instance._middlewareClient = MiddlewareClient.getInstance()
                this._instance._eventDispatcherService = EventDispatcherService.getInstance();
                this._instance._eventDispatcherService.addEventListener('statsChange', this._instance._handleStatsChange.bind(this._instance))
            }
            return this._instance;
        }
    }
});
