var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    ContainerRepository = require("core/repository/container-repository").ContainerRepository,
    MiddlewareTaskRepository = require("core/repository/middleware-task-repository").MiddlewareTaskRepository,
    Model = require("core/model/model").Model;

exports.ContainerSectionService = AbstractSectionService.specialize({

    init: {
        value: function (containerRepository, middlewareTaskRepository) {
            this._middlewareTaskRepository = middlewareTaskRepository || MiddlewareTaskRepository.instance;
            this._containerRepository = containerRepository || ContainerRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._containerRepository.listContainerSections();
        }
    },

    loadSettings: {
        value: function () {
            return this._containerRepository.getDockerContainerSettings();
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

    getDockerImagesWithCollectionName: {
        value: function (collectionName) {
            var self = this,
                promise;

            return new Promise(function (resolve, reject) {
                if (!self._dockerImageService) {
                    promise = Model.populateObjectPrototypeForType(Model.DockerImage).then(function (DockerImage) {
                        self._dockerImageService = DockerImage.constructor.services;

                        return self._dockerImageService.getCollectionImages(collectionName.trim());
                    });
                } else {
                    promise = self._dockerImageService.getCollectionImages(collectionName.trim());
                }

                resolve(promise);
            });
        }
    },

    saveSettings: {
        value: function (settings) {
            return this._containerRepository.saveSettings(settings);
        }
    },

    saveContainer: {
        value: function (container) {
            return this._containerRepository.saveContainer(container);
        }
    },

    pullImageToContainer: {
        value: function (imageName, containerId) {
            var self = this;

            this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs("docker.image.pull", [imageName, containerId]).then(function(middlewareTask) {
                return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
            });
        }
    },

    deleteImageFromContainer: {
        value: function (imageName, containerId) {
            var self = this;

            this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs("docker.image.delete", [imageName, containerId]).then(function(middlewareTask) {
                return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
            });
        }
    }

});
