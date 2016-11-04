var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    SystemRepository = require("core/repository/system-repository").SystemRepository;

exports.SystemSectionService = AbstractSectionService.specialize({
    init: {
        value: function(systemRepository) {
            this._systemRepository = systemRepository || SystemRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._systemRepository.listSystemSections();
        }
    },

    loadSettings: {
        value: function() {
        }
    }

});
