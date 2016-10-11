var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    ContainerRepository = require("core/repository/container-repository").ContainerRepository,
    Model = require("core/model/model").Model;

exports.ContainerSectionService = AbstractSectionService.specialize({

    init: {
        value: function (containerRepository) {
            this._containerRepository = containerRepository || ContainerRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._containerRepository.listContainerSections();
        }
    },

    listDockerContainers: {
        value: function () {
            return this._containerRepository.listDockerContainers();
        }
    },

    listDockerImages: {
        value: function () {
            return this._containerRepository.listDockerImages();
        }
    },

     listDockerHosts: {
        value: function () {
            return this._containerRepository.listDockerHosts();
        }
    },

    listTemplateDockerImages: {
        value: function () {
            var self = this,
                promise;

            return new Promise(function (resolve, reject) {
                if (!self._dockerImageService) {
                    promise = Model.populateObjectPrototypeForType(Model.DockerImage).then(function (DockerImage) {
                        self._dockerImageService = DockerImage.constructor.services;

                        return self._dockerImageService.getTemplates();
                    });
                } else {
                    promise = self._dockerImageService.getTemplates();
                }

                resolve(promise);
            });
        }
    }

});
