var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    NetworkInterfaceDao = require("core/dao/network-interface-dao").NetworkInterfaceDao,
    NetworkConfigDao = require("core/dao/network-config-dao").NetworkConfigDao,
    IpmiDao = require("core/dao/ipmi-dao").IpmiDao;

exports.NetworkRepository = AbstractRepository.specialize({
    init: {
        value: function(networkInterfaceDao, networkConfigDao, ipmiDao) {
            this._networkInterfaceDao = networkInterfaceDao || NetworkInterfaceDao.instance;
            this._networkConfigDao = networkConfigDao || NetworkConfigDao.instance;
            this._ipmiDao = ipmiDao || IpmiDao.instance;
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

    listIpmiChannels: {
        value: function() {
            var self = this;
            return this._IpmiChannelPromise || (this._IpmiChannelPromise = this._ipmiDao.list().then(function(ipmiChannels) {
                return ipmiChannels;
            }));
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
