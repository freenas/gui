var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    ContainerRepository = require("core/repository/container-repository").ContainerRepository,
    MiddlewareTaskRepository = require("core/repository/middleware-task-repository").MiddlewareTaskRepository,
    UserRepository = require("core/repository/user-repository").UserRepository,
    ApplicationContextService = require("core/service/application-context-service").ApplicationContextService
    BackendBridge = require('core/backend/backend-bridge'),
    Model = require("core/model/model").Model;

exports.ContainerSectionService = AbstractSectionService.specialize({

    init: {
        value: function (containerRepository, middlewareTaskRepository, applicationContextService, userRepository) {
            this._middlewareTaskRepository = middlewareTaskRepository || MiddlewareTaskRepository.instance;
            this._containerRepository = containerRepository || ContainerRepository.instance;
            this._applicationContextService = applicationContextService || ApplicationContextService.instance;
            this._userRepository = userRepository || UserRepository.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._containerRepository.listContainerSections();
        }
    },

    loadSettings: {
        value: function () {
            return this.getDockerSettings();
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

    listDockerCollections: {
        value: function () {
            return this._containerRepository.listDockerCollections();
        }
    },

    getDockerSettings: {
        value: function () {
            return this._containerRepository.getDockerContainerSettings();
        }
    },

    getDockerImagesWithCollection: {
        value: function (collection) {
            var self = this,
                promise;

            return new Promise(function (resolve, reject) {
                if (!self._dockerCollectionService) {
                    promise = Model.populateObjectPrototypeForType(Model.DockerCollection).then(function (DockerImage) {
                        self._dockerCollectionService = DockerImage.constructor.services;
                        return self._dockerCollectionService.getEntries(collection.id);
                    });
                } else {
                    promise = self._dockerCollectionService.getEntries(collection.id);
                }

                resolve(promise);
            });
        }
    },

    getNewInstanceRelatedToObjectModel: {
        value: function (object) {
            return this._containerRepository.getNewInstanceRelatedToObjectModel(object);
        }
    },

    getNewDockerCollection: {
        value: function () {
            return this._containerRepository.getNewDockerCollection();
        }
    },

    getNewDockerContainerCreator: {
        value: function () {
            return this._containerRepository.getNewDockerContainerCreator();
        }
    },

    getCurrentUser: {
        value: function () {
            return this._applicationContextService.findCurrentUser();
        }
    },

    getSerialTokenWithDockerContainer: {
        value: function (dockerContainer) {
            return BackendBridge.defaultBackendBridge.send('rpc', 'call', {
                method: 'docker.container.request_interactive_console',
                args: [dockerContainer.id]
            }).then(function (response) {
                return BackendBridge.defaultBackendBridge.send('rpc', 'call', {
                    method: 'docker.container.request_serial_console',
                    args: [response.data]
                });
            }).then(function (response) {
                return response.data;
            });
        }
    },

    saveCurrentUser: {
        value: function (user) {
            return this._userRepository.saveUser(user);
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
