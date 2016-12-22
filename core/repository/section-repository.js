var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    SectionDao = require("core/dao/section-dao").SectionDao,
    SectionSettingsDao = require("core/dao/section-settings-dao").SectionSettingsDao;

exports.SectionRepository = AbstractRepository.specialize({
    init: {
        value: function() {
            this._sectionDao = new SectionDao();
            this._sectionSettingsDao = new SectionSettingsDao();
        }
    },

    getNewSection: {
        value: function() {
            return this._sectionDao.getNewInstance().then(function(section) {
                section._isNew = false;
                return section;
            });
        }
    },

    getNewSectionSettings: {
        value: function() {
            return this._sectionSettingsDao.getNewInstance().then(function(sectionSettings) {
                sectionSettings._isNew = false;
                return sectionSettings;
            });
        }
    }
});
