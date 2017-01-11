var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VolumeDao = require("core/dao/volume-dao").VolumeDao,
    MailDao = require("core/dao/mail-dao").MailDao,
    ShareDao = require("core/dao/share-dao").ShareDao,
    UserDao = require("core/dao/user-dao").UserDao,
    DirectoryDao = require("core/dao/directory-dao").DirectoryDao,
    DirectoryServicesDao = require("core/dao/directory-services-dao").DirectoryServicesDao,
    SystemGeneralDao = require("core/dao/system-general-dao").SystemGeneralDao;

exports.WizardRepository = AbstractRepository.specialize({

    init: {
        value: function(systemGeneralDao, volumeDao, directoryServicesDao, mailDao, shareDao, userDao) {
            this._systemGeneralDao = systemGeneralDao || new SystemGeneralDao();
            this._volumeDao = volumeDao || new VolumeDao();
            this._directoryServicesDao = directoryServicesDao || new DirectoryServicesDao();
            this._mailDao = mailDao || new MailDao();
            this._shareDao = shareDao || new ShareDao();
            this._userDao = userDao || new UserDao();
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
            return this._mailDao.getNewInstance();
        }
    },

    getNewUser: {
        value: function () {
            return this._userDao.getNewInstance();
        }
    },

    saveUser: {
        value: function(user) {
            return this._userDao.save(user);
        }
    },

    getNewShare: {
        value: function () {
            return this._shareDao.getNewInstance();
        }
    },

    saveShare: {
        value: function (object) {
            return this._shareDao.save(object);
        }
    },

    saveMailData: {
        value: function (object) {
            return this._mailDao.save(object);
        }
    },

    saveSystemGeneral: {
        value: function (object) {
            return this._systemGeneralDao.save(object);
        }
    },

    saveDirectory: {
        value: function (object) {
            return this._directoryDao.save(object);
        }
    },

});
