var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    StorageRepository = require("core/repository/storage-repository").StorageRepository,
    NetworkRepository = require("core/repository/network-repository").NetworkRepository;

exports.DashboardSectionService = AbstractSectionService.specialize({

    init: {
        value: function(storageRepository, networkRepository) {
            this._storageRepository = storageRepository || StorageRepository.instance;
            this._networkRepository = networkRepository || NetworkRepository.instance;
        }
    },

    loadDatasets: {
        value: function() {
            return this._storageRepository.listVolumeDatasets();
        }
    },

    loadDisks: {
        value: function() {
            return this._storageRepository.listDisks();
        }
    },

    loadNetworkInterfaces: {
        value: function() {
            return this._networkRepository.listNetworkInterfaces();
        }
    }
});
