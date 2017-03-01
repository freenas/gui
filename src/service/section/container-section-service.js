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
            return this._dockerContainerRepository.list();
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
        value: function (container) {
            if (container._command) {
                container.command = container._command.split(" ");
            }

            if (container._environments) {
                container.environment = container._environments
                    .filter(function(entry) { return entry.id && entry.value})
                    .map(function(parts) { return parts.id + '=' + parts.value; });
            }

            if (container.ports) {
                container.ports = container.ports
                    .filter(function (entry) { return entry.host_port && entry.container_port; });
            }

            if (container.volumes) {
                container.volumes = container.volumes
                    .filter(function(entry) { return entry.host_path && entry.container_path; });
            }

            if (container.primary_network_mode !== 'BRIDGED') {
                container.bridge.address = null;
                container.bridge.macaddress = null;
                container.bridge.dhcp = false;
            }

            return this._dockerContainerRepository.saveContainer(container);
        }
    },

    copyImageToContainer: {
        value: function(image, container) {
            container.image = image.name;
            container.ports = _.cloneDeep(image.presets.ports);
            container.expose_ports = image.presets.expose_ports;
            container._environments = _.cloneDeep(image.presets.settings);
            container.volumes = _.cloneDeep(image.presets.volumes);
            container._command = _.join(image.presets.command, ' ');
            container.autostart = image.presets.autostart;
            container.privileged = image.presets.privileged;
            container.interactive = image.presets.interactive;
            container.primary_network_mode = image.presets.primary_network_mode || 'NAT';
            return this.getNewDockerContainerBridge().then(function(bridge) {
                bridge.dhcp = image.presets.bridge.dhcp;
                bridge.address = image.presets.bridge.address;
                container.bridge = bridge
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
            return this._dockerNetworkRepository.saveDockerNetwork(dockerNetwork);
        }
    },

    findDockerNetworkWithName: {
        value: function (name) {
            return this._dockerNetworkRepository.findNetworkWithName(name);
        }
    },

    connectContainersToNetwork: {
        value: function (containersIds, dockerNetwork) {
            if (dockerNetwork && containersIds) {
                return this._dockerNetworkRepository.connectContainersToNetwork(_.castArray(containersIds), dockerNetwork.id)
            }

            return Promise.resolve();
        }
    },

    disconnectContainersFromNetwork: {
        value: function (containers, dockerNetwork) {
            if (dockerNetwork && containers) {
                return this._dockerNetworkRepository.disconnectContainersFromNetwork(_.castArray(containers), dockerNetwork.id);
            }
            return Promise.resolve();
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
        value: function(dockerHost) {
            return this._vmRepository.stopVm(dockerHost);
        }
    },

    killDockerHost: {
        value: function(dockerHost) {
            return this._vmRepository.stopVm(dockerHost, true);
        }
    },

    rebootDockerHost: {
        value: function(dockerHost) {
            return this._vmRepository.rebootVm(dockerHost);
        }
    }

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
