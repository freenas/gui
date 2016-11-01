var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    NetworkRoute = require('core/model/models/network-route').NetworkRoute,
    Model = require("core/model/model").Model,
    NotificationCenterModule = require("core/backend/notification-center");

exports.Settings = AbstractInspector.specialize({

    _routeTaskIds: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            this.super();

            if (isFirstTime) {
                this._dataService = this.application.dataService;

                // Subscribe to task done events to be able to
                // reset UI on the completion of tasks submitted
                NotificationCenterModule.defaultNotificationCenter.addEventListener("taskDone", this);

                return this._sectionService.loadStaticRoutes().then(function(routes) {
                    self._networkRoutes = routes;
                    self._networkRoutes.addRangeChangeListener(self, "networkRoutes");

                    self.routes = self._networkRoutes.map(self._mapRouteToRawData);
                });
            }
        }
    },
    
    revert: {
        value: function() {
            return Promise.all([
                this._resetStaticRoutes(),
                this._sectionService.revertSettings()
            ]);
        }
    },

    save: {
        value: function() {
            return Promise.all([
                this._saveStaticRoutes(),
                this._sectionService.saveSettings()
            ]);
        }
    },

    handleNetworkRoutesRangeChange: {
        value: function(plus, minus, index) {
            return this._resetStaticRoutes();
        }
    },

    handleTaskDone: {
        value: function(event) {
            var taskId = event.detail.jobId;
            if (this._routeTaskIds) {
                this._routeTaskIds.delete(taskId);
                if (this._routeTaskIds.length == 0) {
                    this._routeTaskIds = null;
                    this._resetStaticRoutes();
                }
            }
        }
    },

    _resetStaticRoutes: {
        value: function() {
            this.routes = this._networkRoutes.map(this._mapRouteToRawData);
            return Promise.resolve();
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
                    promises.push(self._saveStaticRouteRaw(createdRoute));
                });
                
                routes.forEach(function(route) {
                    var newRoute = existingRoutes[route.persistedId];
                    if (!newRoute) { // deleted
                        promises.push(self._sectionService.deleteStaticRoute(route));
                    } else if (route.id !== newRoute.id
                        || route.gateway !== newRoute.gateway
                        || route.network !== newRoute.network.address
                        || route.netmask !== newRoute.network.netmask
                        || route.type !== newRoute.network.type) { // updated
                        promises.push(self._saveStaticRouteRaw(newRoute));
                    }
                });

                return Promise.all(promises);
            }).then(function(taskIds) {
                self._routeTaskIds = taskIds;
            });
        }
    },

    _saveStaticRouteRaw: {
        value: function(route) {
            var self = this;
            return this._dataService.getNewInstanceForType(Model.NetworkRoute)
                .then(function(newRoute) {
                    newRoute._isNew = !route.persistedId;
                    return self._mergeRawDataToRoute(route, newRoute);
                })
                .then(function(mergedRoute) {
                    return self._sectionService.saveStaticRoute(mergedRoute);
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
