var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    DockerContainerRepository = require("core/repository/docker-container-repository").DockerContainerRepository,
    DockerHostRepository = require("core/repository/docker-host-repository").DockerHostRepository,
    DockerImageRepository = require("core/repository/docker-image-repository").DockerImageRepository,
    DockerCollectionRepository = require("core/repository/docker-collection-repository").DockerCollectionRepository,
    DockerNetworkRepository = require("core/repository/docker-network-repository").DockerNetworkRepository,
    DockerConfigRepository = require("core/repository/docker-config-repository").DockerConfigRepository,
    DockerContainerLogsRepository = require("core/repository/docker-container-logs-repository").DockerContainerLogsRepository,
    DockerContainerBridgeRepository = require("core/repository/docker-container-bridge-repository").DockerContainerBridgeRepository,
    VmRepository = require("core/repository/vm-repository").VmRepository,
    VmDatastoreRepository = require("core/repository/VmDatastoreRepository").VmDatastoreRepository,
    CONSTANTS = require("core/constants"),
    BytesService = require("core/service/bytes-service").BytesService,
    ApplicationContextService = require("core/service/application-context-service").ApplicationContextService,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient,
    Model = require("core/model").Model,
    _ = require("lodash");

exports.ContainerSectionService = AbstractSectionService.specialize({
    DEFAULT_STRING: {
        value: CONSTANTS.DEFAULT_SELECT_STRING
    },

    init: {
        value: function () {
            this._applicationContextService = ApplicationContextService.instance;
            this._dockerContainerRepository = DockerContainerRepository.getInstance();
            this._dockerNetworkRepository = DockerNetworkRepository.getInstance();
            this._dockerHostRepository = DockerHostRepository.getInstance();
            this._dockerImageRepository = DockerImageRepository.getInstance();
            this._dockerCollectionRepository = DockerCollectionRepository.getInstance();
            this._dockerConfigRepository = DockerConfigRepository.getInstance();
            this._dockerContainerLogsRepository = DockerContainerLogsRepository.getInstance();
            this._dockerContainerBridgeRepository = DockerContainerBridgeRepository.getInstance();
            this._vmRepository = VmRepository.getInstance();
            this._vmDatastoreRepository = VmDatastoreRepository.getInstance();
            this._bytesService = BytesService.instance;
        }
    },

    loadEntries: {
        value: function() {
            return Promise.all([
                this._dockerContainerRepository.getEmptyList(),
                this._dockerHostRepository.getEmptyList(),
                this._dockerImageRepository.getEmptyList(),
                this._dockerCollectionRepository.getEmptyList()
            ]).then(function (entries) {
                return _.assign(entries, {_objectType: Model.DockerContainerSection});
            });
        }
    },

    loadSettings: {
        value: function () {
            return this.getDockerSettings();
        }
    },

    listDockerContainers: {
        value: function () {
            return this._dockerContainerRepository.listDockerContainers();
        }
    },

    listDockerImages: {
        value: function () {
            return this._dockerImageRepository.listDockerImages();
        }
    },

    listDockerHosts: {
        value: function () {
            return this._dockerHostRepository.listDockerHosts();
        }
    },

    listDockerCollections: {
        value: function () {
            return this._dockerCollectionRepository.listDockerCollections();
        }
    },

    getDockerSettings: {
        value: function () {
            return this._dockerConfigRepository.getDockerContainerSettings();
        }
    },

    getDockerImagesWithCollection: {
        value: function (collection) {
            return this._dockerCollectionRepository.getDockerImagesWithCollection(collection);
        }
    },

    getNewInstanceFromObjectType: {
        value: function (objectType) {
            return objectType === Model.DockerContainer ?
                this._dockerContainerRepository.getNewDockerContainer() :
                this._dockerImageRepository.getNewDockerImage();
        }
    },

    getNewDockerContainerLogs: {
        value: function () {
            return this._dockerContainerLogsRepository.getNewDockerContainerLogs();
        }
    },

    getNewDockerCollection: {
        value: function () {
            return this._dockerCollectionRepository.getNewDockerCollection();
        }
    },

    getNewDockerContainerBridge: {
        value: function () {
            return this._dockerContainerBridgeRepository.getNewDockerContainerBridge();
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

            return this._dockerContainerRepository.getInteractiveConsoleToken(dockerContainer.id).then(function (response) {
                return self.getSerialTokenWithDockerContainerId(response);
            });
        }
    },

    getSerialTokenWithDockerContainerId: {
        value: function (dockerContainerId) {
            return this._dockerContainerRepository.getSerialConsoleToken(dockerContainerId);
        }
    },

    getSerialConsoleUrl: {
        value: function (token) {
            return MiddlewareClient.getRootURL('http') + "/serial-console-app/#" + token;
        }
    },

    getSerialConsoleUrlForDockerHost: {
        value: function (dockerHost) {
            return this._vmRepository.getSerialToken(dockerHost).then(function(token) {
                return MiddlewareClient.getRootURL('http') + '/serial-console-app/#' + token;
            });
        }
    },

    saveSettings: {
        value: function (settings) {
            return this._dockerConfigRepository.saveSettings(settings);
        }
    },

    getPrimaryNetWorkModes: {
        value: function () {
            return this.constructor.primaryNetWorkModes;
        }
    },

    saveContainer: {
        value: function (container, options) {
            var environments = [];

            if (options.command) {
                container.command = options.command.split(" ");
            }

            if (container.memory_limit) {
                container.memory_limit = this._bytesService.convertStringToSize(
                    container.memory_limit, this._bytesService.UNITS.M
                ) || void 0;
            }

            if (options.settings && options.settings.length) {
                try {
                    environments = this._getVariablesFromArray(options.settings);
                } catch (e) {
                    //TODO
                }
            }

            if (options.environments) {
                container.environment = environments.concat(
                    this._getVariablesFromArray(options.environments)
                );
            }

            if (options.ports) {
                container.ports = options.ports.filter(function (entry) {
                    return entry.host_port && entry.container_port;
                });
            }

            if (options.volumes) {
                container.volumes = this._extractValidVolumes(options.volumes);
            }

            if (container.primary_network_mode !== 'BRIDGED') {
                container.bridge.address = null;
                container.bridge.macaddress = null;
                container.bridge.dhcp = false;
            }

            return this._dockerContainerRepository.saveContainer(container);
        }
    },

    _extractValidVolumes: {
        value: function(values) {
            var volumes = [],
                entry;

            for (var i = values.length - 1; i >= 0; i--) {
                entry = values[i];

                if (entry.host_path && entry.container_path) {
                    delete entry.isLocked;
                    volumes.push(entry);
                }
            }

            return volumes;
        }
    },

    _getVariablesFromArray: {
        value: function (array) {
            return array.filter(function (entry) {
                var shouldKeep = !!(entry.variable && entry.value);

                if (!shouldKeep && entry.optional !== void 0 && entry.optional === true) {
                    throw new Error("missing setting");
                }

                return shouldKeep;
            }).map(function (entry) {
                return entry.variable + "=" + entry.value;
            });
        }
    },

    pullDockerImageToDockerHost: {
        value: function (imageName, dockerHostId) {
            return this._dockerImageRepository.pullImageToHost(imageName, dockerHostId);
        }
    },

    deleteDockerImageFromDockerHost: {
        value: function (imageId, dockerHostId) {
            return this._dockerImageRepository.deleteImageFromHost(imageId, dockerHostId);
        }
    },

    deleteDockerImage: {
        value: function (dockerImage) {
            return this._dockerImageRepository.deleteImageFromHost(dockerImage.id, null);
        }
    },

    startContainer: {
        value: function(container) {
            return this._dockerContainerRepository.startContainer(container);
        }
    },

    restartContainer: {
        value: function(container) {
            return this._dockerContainerRepository.restartContainer(container);
        }
    },

    stopContainer: {
        value: function(container) {
            return this._dockerContainerRepository.stopContainer(container);
        }
    },

    getReadmeforDockerImage: {
        value: function(dockerImageName) {
            return this._dockerImageRepository.getReadmeForDockerImage(dockerImageName);
        }
    },

    getNewDockerNetwork: {
        value: function () {
            return this._dockerNetworkRepository.getNewDockerNetwork();
        }
    },

    listDockerNetworks: {
        value: function () {
            return this._dockerNetworkRepository.listDockerNetworks();
        }
    },

    saveDockerNetwork: {
        value: function (dockerNetwork) {
            var self = this,
                newContainers = dockerNetwork.containers;

            return this._dockerNetworkRepository.saveDockerNetwork(dockerNetwork).then(function (task) {
                task.taskPromise.then(function () {
                    //@pierre: need discussion, probably not safe except if the name is unique.
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
            return this._dockerNetworkRepository.findNetworkWithName(name);
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
            return this._dockerNetworkRepository.connectContainerToNetwork(containerId, dockerNetworkId);
        }
    },

    disconnectContainersFromNetwork: {
        value: function (containers, dockerNetwork) {
            var self = this,
                networkId = dockerNetwork.id,
                promise = null;
            if (dockerNetwork && containers) {
                promise = Promise.all(_.map(containers, function(containerId) {
                    return self.disconnectContainerFromNetwork(containerId, networkId);
                }));
            }
            return Promise.resolve(promise);
        }
    },

    disconnectContainerFromNetwork: {
        value: function (containerId, dockerNetworkId) {
            return this._dockerNetworkRepository.disconnectContainerFromNetwork(containerId, dockerNetworkId);
        }
    },

    generateMacAddress: {
        value: function () {
            return this._dockerContainerRepository.generateMacAddress();
        }
    },

    listDatastores: {
        value: function() {
            return this._vmDatastoreRepository.list();
        }
    },

    initializeDockerHost: {
        value: function(dockerHost) {
            if (!dockerHost.status) {
                dockerHost.status = {};
                dockerHost.status._objectType = 'DockerHostStatus';
            }
            if (dockerHost._isNew) {
                dockerHost.config = {
                    ncpus: 1,
                    memsize: 2048
                };
            }
        }
    },

    saveDockerHost: {
        value: function(dockerHost) {
            dockerHost.target = dockerHost.target === this.DEFAULT_STRING ? null : dockerHost.target;
            return this._dockerHostRepository.save(dockerHost);
        }
    },


    startDockerHost: {
        value: function(dockerHost) {
            return this._vmRepository.startVm(dockerHost);
        }
    },

    stopDockerHost: {
        value: function(dockerHost, force) {
            return this._vmRepository.stopVm(dockerHost);
        }
    },

    killDockerHost: {
        value: function(dockerHost, force) {
            return this._vmRepository.stopVm(dockerHost, true);
        }
    },

    rebootDockerHost: {
        value: function(dockerHost) {
            return this._vmRepository.rebootVm(dockerHost);
        }
    },


}, {
    primaryNetWorkModes: {
        value: [
            {label: 'Bridged', value: 'BRIDGED'},
            {label: 'NAT', value: 'NAT'},
            {label: 'Host', value: 'HOST'},
            {label: 'None', value: 'NONE'}
        ]
    }
});
