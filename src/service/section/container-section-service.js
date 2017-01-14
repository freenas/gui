var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    ContainerRepository = require("core/repository/container-repository").ContainerRepository,
    DockerContainerRepository = require("core/repository/docker-container-repository-ng").DockerContainerRepository,
    DockerHostRepository = require("core/repository/docker-host-repository-ng").DockerHostRepository,
    DockerImageRepository = require("core/repository/docker-image-repository-ng").DockerImageRepository,
    DockerCollectionRepository = require("core/repository/docker-collection-repository-ng").DockerCollectionRepository,
    DockerNetworkRepository = require("core/repository/docker-network-repository").DockerNetworkRepository,
    MiddlewareTaskRepository = require("core/repository/middleware-task-repository").MiddlewareTaskRepository,
    UserRepository = require("core/repository/user-repository").UserRepository,
    ApplicationContextService = require("core/service/application-context-service").ApplicationContextService,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient,
    _ = require("lodash");

exports.ContainerSectionService = AbstractSectionService.specialize({

    init: {
        value: function (containerRepository, middlewareTaskRepository, applicationContextService, userRepository) {
            this._middlewareTaskRepository = middlewareTaskRepository || MiddlewareTaskRepository.instance;
            this._containerRepository = containerRepository || ContainerRepository.instance;
            this._applicationContextService = applicationContextService || ApplicationContextService.instance;
            this._userRepository = userRepository || UserRepository.instance;
            DockerContainerRepository.getInstance();
            DockerNetworkRepository.getInstance();
            DockerHostRepository.getInstance();
            DockerImageRepository.getInstance();
            DockerCollectionRepository.getInstance();
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
            return this._containerRepository.getDockerImagesWithCollection(collection);
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
                return self.getSerialTokenWithDockerContainerId(response);
            });
        }
    },

    getSerialTokenWithDockerContainerId: {
        value: function (dockerContainerId) {
            return this._containerRepository.getSerialConsoleToken(dockerContainerId).then(function (response) {
                return response;
            });
        }
    },

    getSerialConsoleUrl: {
        value: function (token) {
            return MiddlewareClient.getRootURL('http') + "/serial-console-app/#" + token;
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
    },

    startContainer: {
        value: function(container) {
            return this._containerRepository.startContainer(container);
        }
    },

    stopContainer: {
        value: function(container) {
            return this._containerRepository.stopContainer(container);
        }
    },

    getReadmeforDockerImage: {
        value: function(dockerImageName) {
            return this._containerRepository.getReadmeforDockerImage(dockerImageName);
        }
    },

    getNewDockerNetwork: {
        value: function () {
            return this._containerRepository.getNewDockerNetwork();
        }
    },

    listDockerNetworks: {
        value: function () {
            return this._containerRepository.listDockerNetworks();
        }
    },

    saveDockerNetwork: {
        value: function (dockerNetwork) {
            var self = this,
                newContainers = dockerNetwork.containers,
                previousContainers;

            return this._containerRepository.saveDockerNetwork(dockerNetwork).then(function (task) {
                task.taskPromise.then(function () {
                    //@pierre: need discution, probably not safe except if the name is unique.
                    return self.findDockerNetworkWithName(dockerNetwork.name);
                }).then(function (networks) {
                    var containersToAdd, containersToRemove,
                        network = networks[0],
                        previousContainers = network.containers,
                        promises = [];

                    if (newContainers && previousContainers) {
                       containersToAdd =  _.difference(newContainers, previousContainers);
                       containersToRemove =  _.difference(previousContainers, newContainers);
                    } else if (newContainers && newContainers.length) {
                       containersToAdd =  newContainers;
                    } else {
                        containersToRemove = previousContainers;
                    }

                    if (containersToAdd && containersToAdd.length) {
                        promises.push(self.connectContainersToNetwork(containersToAdd, network));
                    }

                    if (containersToRemove && containersToRemove.length) {
                        promises.push(self.disconnectContainersFromNetwork(containersToRemove, network));
                    }


                    return Promise.all(promises);
                });

                return task;
            });
        }
    },

    findDockerNetworkWithName: {
        value: function (name) {
            return this._containerRepository.findNetworkWithName(name);
        }
    },

    connectContainersToNetwork: {
        value: function (containers, dockerNetwork) {
            if (dockerNetwork && containers) {
                var promises = [];

                for (var i = 0, length = containers.length; i < length; i++) {
                    promises.push(this.connectContainerToNetwork(containers[i], dockerNetwork.id));
                }

                return Promise.all(promises);
            }

            return Promise.resolve(null);
        }
    },

    connectContainerToNetwork: {
        value: function (containerId, dockerNetworkId) {
            var self = this;

            this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs("docker.network.connect", [containerId, dockerNetworkId]).then(function(middlewareTask) {
                return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
            });
        }
    },

     disconnectContainersFromNetwork: {
        value: function (containers, dockerNetwork) {
            if (dockerNetwork && containers) {
                var promises = [];

                for (var i = 0, length = containers.length; i < length; i++) {
                    promises.push(this.disconnectContainerFromNetwork(containers[i], dockerNetwork.id));
                }

                return Promise.all(promises);
            }

            return Promise.resolve(null);
        }
    },

    disconnectContainerFromNetwork: {
        value: function (containerId, dockerNetworkId) {
            var self = this;

            this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs("docker.network.disconnect", [containerId, dockerNetworkId]).then(function(middlewareTask) {
                return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
            });
        }
    }

});
