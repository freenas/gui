var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    NetworkInterfaceDao = require("core/dao/network-interface-dao").NetworkInterfaceDao,
    NetworkConfigDao = require("core/dao/network-config-dao").NetworkConfigDao;

exports.NetworkRepository = AbstractRepository.specialize({
    init: {
        value: function(networkInterfaceDao, networkConfigDao) {
            this._networkInterfaceDao = networkInterfaceDao || NetworkInterfaceDao.instance;
            this._networkConfigDao = networkConfigDao || NetworkConfigDao.instance;
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
