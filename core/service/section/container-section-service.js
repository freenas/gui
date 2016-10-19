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

    pullDockerImageToDockerHost: {
        value: function (imageName, dockerHostId) {
            var self = this;

            this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs("docker.image.pull", [imageName, dockerHostId]).then(function(middlewareTask) {
                return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
            });
        }
    },

    deleteDockerImageFromDockerHost: {
        value: function (imageName, dockerHostId) {
            var self = this;

            this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs("docker.image.delete", [imageName, dockerHostId]).then(function(middlewareTask) {
                return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
            });
        }
    },

    deleteDockerImage: {
        value: function (dockerImage) {
            var self = this;

            this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs("docker.image.delete", [dockerImage.names[0], null]).then(function(middlewareTask) {
                return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
            });
        }
    }

});
