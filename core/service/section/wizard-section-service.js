var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    WizardRepository = require("core/repository/wizard-repository").WizardRepository;

exports.WizardSectionService = AbstractSectionService.specialize({

    init: {
        value: function (wizardRepository) {
            this._wizardRepository = wizardRepository || WizardRepository.instance;
        }
    },

    getNewSystemGeneral: {
        value: function () {
            return this._wizardRepository.getNewSystemGeneral();
        }
    },

    getNewVolume: {
        value: function () {
            return this._wizardRepository.getNewVolume();
        }
    },

    getNewDirectoryServices: {
        value: function () {
            return this._wizardRepository.getNewDirectoryServices();
        }
    },

    getMailData: {
        value: function () {
            return this._wizardRepository.getMailData();
        }
    },

    getNewShare: {
        value: function () {
            return this._wizardRepository.getNewShare();
        }
    }

},
//TODO: remove when wizard will have been migrated to the new architecture.
{
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
                this._instance.init();
             }
            return this._instance;
         }
    }

});
