var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    ContainerRepository = require("core/repository/container-repository").ContainerRepository;

exports.ContainerSectionService = AbstractSectionService.specialize({
    init: {
        value: function (containerRepository) {
            this._containerRepository = containerRepository || ContainerRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._containerRepository.listContainers();
        }
    }

});
