var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    NetworkInterfaceDao = require("core/dao/network-interface-dao").NetworkInterfaceDao,
    NetworkConfigDao = require("core/dao/network-config-dao").NetworkConfigDao,
    NetworkRouteDao = require("core/dao/network-route-dao").NetworkRouteDao,
    NetworkHostDao = require("core/dao/network-host-dao").NetworkHostDao;

exports.NetworkRepository = AbstractRepository.specialize({
    init: {
        value: function(networkInterfaceDao, networkConfigDao, networkRouteDao, networkHostDao) {
            this._networkInterfaceDao = networkInterfaceDao || NetworkInterfaceDao.instance;
            this._networkConfigDao = networkConfigDao || NetworkConfigDao.instance;
            this._networkRouteDao = networkRouteDao || NetworkRouteDao.instance;
            this._networkHostDao = networkHostDao || NetworkHostDao.instance;
        }
    },

    listNetworkInterfaces: {
        value: function() {
            return this._networkInterfaceDao.list();
        }
    },

    saveNetworkInterface: {
        value: function(networkInterface) {
            return this._networkInterfaceDao.save(networkInterface);
        }
    },

    listNetworkStaticRoutes: {
        value: function() {
            return this._networkRouteDao.list();
        }
    },

    getNewNetworkStaticRoute: {
        value: function() {
            return this._networkRouteDao.getNewInstance();
        }
    },

    saveNetworkStaticRoute: {
        value: function(route) {
            return this._networkRouteDao.save(route);
        }
    },

    deleteNetworkStaticRoute: {
        value: function(route) {
            return this._networkRouteDao.delete(route);
        }
    },

    listNetworkHosts: {
        value: function() {
            return this._networkHostDao.list();
        }
    },

    getNewNetworkHost: {
        value: function() {
            return this._networkHostDao.getNewInstance();
        }
    },

    saveNetworkHost: {
        value: function(host) {
            return this._networkHostDao.save(host);
        }
    },

    deleteNetworkHost: {
        value: function(host) {
            return this._networkHostDao.delete(host);
        }
    },

    getNetworkOverview: {
        value: function() {
            var self = this;
            this._networkOverview = {};
            return Promise.all([
                this._networkInterfaceDao.list(),
                this._networkConfigDao.get()
            ]).then(function(results) {
                self._networkOverview.interfaces = results[0];
                self._networkOverview.config = results[1];
                return self._networkOverview;
            });
        }
    },

    getNetworkSettings: {
        value: function() {
            var self = this;
            this._networkSettings = {};
            return this._networkConfigDao.get().then(function(config) {
                self._networkSettings.config = config;
                return self._networkSettings;
            });
        }
    },

    revertNetworkSettings: {
        value: function() {
            return this._networkConfigDao.revert(this._networkSettings.config);
        }
    },

    saveNetworkSettings: {
        value: function() {
            return this._networkConfigDao.save(this._networkSettings.config);
        }
    }
});
