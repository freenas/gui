var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    ContainerDao = require("core/dao/container-dao").ContainerDao;

exports.ContainerRepository = AbstractRepository.specialize({
    init: {
        value: function (containerDao) {
            this._containerDao = containerDao || ContainerDao.instance;
        }
    },

    listContainers: {
        value: function () {
            return this._containerDao.list();
        }
    }
});
