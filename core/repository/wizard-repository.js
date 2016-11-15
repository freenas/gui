var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VolumeDao = require("core/dao/volume-dao").VolumeDao,
    MailDao = require("core/dao/mail-dao").MailDao,
    ShareDao = require("core/dao/share-dao").ShareDao,
    DirectoryServicesDao = require("core/dao/directory-services-dao").DirectoryServicesDao,
    SystemGeneralDao = require("core/dao/system-general-dao").SystemGeneralDao;

exports.WizardRepository = AbstractRepository.specialize({

    init: {
        value: function(systemGeneralDao, volumeDao, directoryServicesDao, mailDao, shareDao) {
            this._systemGeneralDao = systemGeneralDao || SystemGeneralDao.instance;
            this._volumeDao = volumeDao || VolumeDao.instance;
            this._directoryServicesDao = directoryServicesDao || DirectoryServicesDao.instance;
            this._mailDao = mailDao || MailDao.instance;
            this._shareDao = shareDao || ShareDao.instance;
        }
    },

    getNewSystemGeneral: {
        value: function () {
            return this._systemGeneralDao.getNewInstance();
        }
    },

    getNewVolume: {
        value: function () {
            return this._volumeDao.getNewInstance();
        }
    },

    getNewDirectoryServices: {
        value: function () {
            return this._directoryServicesDao.getNewInstance();
        }
    },

    getNewMail: {
        value: function () {
            return this._mailDao.getNewInstance();
        }
    },

    getMailData: {
        value: function () {
            return this._mailDao.get();
        }
    },

    getNewShare: {
        value: function () {
            return this._shareDao.getNewInstance();
        }
    }

});
