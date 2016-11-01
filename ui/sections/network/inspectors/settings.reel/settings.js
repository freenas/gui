var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    NetworkRoute = require('core/model/models/network-route').NetworkRoute,
    Model = require("core/model/model").Model;

exports.Settings = AbstractInspector.specialize({

    enterDocument: {
        value: function(isFirstTime) {
            this.super();

            if (isFirstTime) {
                this._dataService = this.application.dataService;
                this._loadStaticRoutes();
            }
        }
    },
    
    revert: {
        value: function() {
            return Promise.all([
                this._loadStaticRoutes(),
                this._sectionService.revertSettings()
            ]);
        }
    },

    save: {
        value: function() {
            var self = this;            
            return Promise.all([
                this._saveStaticRoutes(),
                this._sectionService.saveSettings()
            ]);
        }
    },

    _loadStaticRoutes: {
        value: function() {
            var self = this;
            return this._sectionService.loadStaticRoutes().then(function(routes) {
                self.routes = routes.map(self._mapRouteToRawData);
            });
        }
    },

    _saveStaticRoutes: {
        value: function() {
            var self = this,
                createdRoutes = [],
                existingRoutes = {};

            this.routes.forEach(function(route) {
                if (route.persistedId) {
                    existingRoutes[route.persistedId] = route;
                } else {
                    createdRoutes.push(route);
                }
            });

            return this._sectionService.loadStaticRoutes().then(function(routes) {
                var promises = [];

                // newly created routes
                createdRoutes.forEach(function(createdRoute) {
                    var createPromise = self._dataService.getNewInstanceForType(Model.NetworkRoute)
                        .then(function(newRoute) {
                            return self._mergeRawDataToRoute(createdRoute, newRoute);
                        })
                        .then(function(mergedRoute) {
                            return self._sectionService.saveStaticRoute(mergedRoute);
                        });
                    promises.push(createPromise);
                });
                
                routes.forEach(function(route) {
                    var newRoute = existingRoutes[route.persistedId];
                    if (!newRoute) { // deleted
                        promises.push(self._sectionService.deleteStaticRoute(route));
                    } else if (newRoute.id !== route.id
                        || newRoute.gateway !== route.gateway
                        || newRoute.network.address !== route.network
                        || newRoute.network.netmask !== route.netmask
                        || newRoute.network.type !== route.type) { // updated
                        var mergedRoute = self._mergeRawDataToRoute(newRoute, route);
                        promises.push(self._sectionService.saveStaticRoute(mergedRoute));
                    }
                });

                return Promise.all(promises);
            });
        }
    },

    _mapRouteToRawData: {
        value: function(route) {
            return {
                id: route.id,
                network: {
                    address: route.network,
                    netmask: route.netmask,
                    type: route.type
                },
                gateway: route.gateway,
                persistedId: route.persistedId
            };
        }
    },

    _mergeRawDataToRoute: {
        value: function(raw, route) {
            route = route || {};
            if (raw.persistedId) {
                route.persistedId = raw.persistedId;
            }
            route.id = raw.id;
            route.network = raw.network.address;
            route.netmask = raw.network.netmask;
            route.type = raw.network.type;
            route.gateway = raw.gateway;
            return route;
        }
    }
});
