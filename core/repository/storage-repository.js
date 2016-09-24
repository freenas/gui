var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VolumeDao = require("core/dao/volume-dao").VolumeDao;

exports.StorageRepository = AbstractRepository.specialize({
    init: {
        value: function(volumeDao) {
            this._volumeDao = volumeDao || VolumeDao.instance;
        }
    },

    listVolumes: {
        value: function() {
            return this._volumeDao.list();
        }
    }
});
