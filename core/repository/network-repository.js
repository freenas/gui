var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    NetworkInterfaceDao = require("core/dao/network-interface-dao").NetworkInterfaceDao;

exports.NetworkRepository = AbstractRepository.specialize({
    init: {
        value: function(networkInterfaceDao) {
            this._networkInterfaceDao = networkInterfaceDao || NetworkInterfaceDao.instance;
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
    }
});
