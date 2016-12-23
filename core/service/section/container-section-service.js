var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    ContainerRepository = require("core/repository/container-repository").ContainerRepository,
    UserRepository = require("core/repository/user-repository").UserRepository,
    ApplicationContextService = require("core/service/application-context-service").ApplicationContextService,
    Model = require("core/model/model").Model;

exports.ContainerSectionService = AbstractSectionService.specialize({

    init: {
        value: function (containerRepository, middlewareTaskRepository, applicationContextService, userRepository) {
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

    getNewInstanceFromObjectType: {
        value: function (objectType) {
            return this._containerRepository.getNewInstanceFromObjectType(objectType);
        }
    },

    getNewDockerContainerLogs: {
        value: function () {
            return this._containerRepository.getNewDockerContainerLogs();
        }
    },

    getNewDockerCollection: {
        value: function () {
            return this._containerRepository.getNewDockerCollection();
        }
    },

    getNewDockerContainerBridge: {
        value: function () {
            return this._containerRepository.getNewDockerContainerBridge();
        }
    },

    getNewDockerContainerCreator: {
        value: function () {
            return this._containerRepository.getNewDockerContainerCreator();
        }
    },

    getNewDockerImagePull: {
        value: function() {
            return this._containerRepository.getNewImagePull();
        }
    },

    getCurrentUser: {
        value: function () {
            return this._applicationContextService.findCurrentUser();
        }
    },

    getInteractiveSerialTokenWithDockerContainer: {
        value: function (dockerContainer) {
            var self = this;

            return this._containerRepository.getInteractiveConsoleToken(dockerContainer.id).then(function (response) {
                return self.getSerialTokenWithDockerContainerId(response.data);
            });
        }
    },

    getSerialTokenWithDockerContainerId: {
        value: function (dockerContainerId) {
            return this._containerRepository.getSerialConsoleToken(dockerContainerId).then(function (response) {
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
            return this._containerRepository.pullImage(imageName, dockerHostId);
        }
    },

    deleteDockerImageFromDockerHost: {
        value: function (imageName, dockerHostId) {
            return this._containerRepository.deleteImage(imageName, dockerHostId);
        }
    },

    deleteDockerImage: {
        value: function (imageName) {
            return this._containerRepository.deleteImage(imageName, null);
        }
    }

});
