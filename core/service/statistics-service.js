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

    getDatasourcesHistory: {
        value: function(datasources, periodInSecs) {
            periodInSecs = periodInSecs || 10;
            return this._callBackend("stat.get_stats", [datasources, {
                timespan:   periodInSecs * 100,
                frequency:  periodInSecs + 's'
            }]).then(function(response) {
                return response.data;
            });
        }
    },

    getDatasourcesCurrentValue: {
        value: function(datasources) {
            return this._callBackend("stat.get_stats", [datasources, {
                timespan:   20,
                frequency:  '10s'
            }]).then(function(response) {
                return response.data;
            });
        }
    },

    subscribeToDatasourcesUpdates: {
        value: function(datasources, listener) {
            var self = this;
            return Promise.all(datasources.map(function(datasource) {
                var name = "statd." + datasource;
                if (self._subscribedUpdates.indexOf(datasource) == -1) {
                    self._subscribedUpdates.push(datasource);
                }
                return self._middlewareClient.subscribeToEvents(name).then(function() {
                    if (!self._listeners.has(name)) {
                        self._listeners.set(name, new Set());
                    }
                    self._listeners.get(name).add(listener);
                    return name;
                });
            }))
        }
    },

    unsubscribeToDatasourcesUpdates: {
        value: function(datasources) {
            var self = this;
            return Promise.all(datasources.map(function(datasource) {
                var name = "statd." + datasource;
                self._listeners.delete(name);
                self._subscribedUpdates.splice(self._subscribedUpdates.indexOf(datasources[i]), 1);
                return self._middlewareClient.unsubscribeFromEvents(name);
            }));
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
