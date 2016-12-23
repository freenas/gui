var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VolumeDao = require("core/dao/volume-dao").VolumeDao,
    MailDao = require("core/dao/mail-dao").MailDao,
    ShareDao = require("core/dao/share-dao").ShareDao,
    UserDao = require("core/dao/user-dao").UserDao,
    DirectoryServicesDao = require("core/dao/directory-services-dao").DirectoryServicesDao,
    SystemGeneralDao = require("core/dao/system-general-dao").SystemGeneralDao;

exports.WizardRepository = AbstractRepository.specialize({

    init: {
        value: function() {
            this._systemGeneralDao = new SystemGeneralDao();
            this._volumeDao = new VolumeDao();
            this._directoryServicesDao = new DirectoryServicesDao();
            this._mailDao = new MailDao();
            this._shareDao = new ShareDao();
            this._userDao = new UserDao();
        }
    },

    getNewDirectoryServices: {
        value: function () {
            return this._directoryServicesDao.getNewInstance();
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
