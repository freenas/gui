var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model;

exports.SectionRepository = AbstractRepository.specialize({
    init: {
        value: function(dataService) {
            this._dataService = dataService || FreeNASService.instance;
        }
    },

    getNewSection: {
        value: function() {
            return this._dataService.getNewInstanceForType(Model.Section).then(function(section) {
                section._isNew = false;
                return section;
            });
        }
    },

    getNewSectionSettings: {
        value: function() {
            return this._dataService.getNewInstanceForType(Model.SectionSettings).then(function(sectionSettings) {
                sectionSettings._isNew = false;
                return sectionSettings;
            });
        }
    }
});
