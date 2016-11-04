var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    SystemGeneralDao = require("core/dao/system-general-dao").SystemGeneralDao,
    SystemSectionDao = require("core/dao/system-section-dao").SystemSectionDao;

exports.SystemRepository = AbstractRepository.specialize({
    init: {
        value: function(systemGeneralDao, systemSectionDao) {
            this._systemGeneralDao = systemGeneralDao || SystemGeneralDao.instance;
            this._systemSectionDao = systemSectionDao || SystemSectionDao.instance;
        }
    },

    getSystemGeneral: {
        value: function() {
            var self = this;
            return this._systemGeneralDao.get().then(function(systemGeneral) {
                return self._systemGeneral = systemGeneral;
            });
        }
    },

    revertSystemGeneral: {
        value: function() {
            return this._systemGeneralDao.revert(this._systemGeneral);
        }
    },

    saveSystemGeneral: {
        value: function() {
            return this._systemGeneralDao.save(this._systemGeneral);
        }
    },

    listSystemSections: {
        value: function() {
            return this._systemSectionDao.list();
        }
    }
});
