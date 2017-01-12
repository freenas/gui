var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    DockerContainerSectionDao = require("core/dao/docker-container-section-dao").DockerContainerSectionDao,
    DockerImageDao = require("core/dao/docker-image-dao").DockerImageDao,
    DockerHostDao = require("core/dao/docker-host-dao").DockerHostDao,
    DockerConfigDao = require("core/dao/docker-config-dao").DockerConfigDao,
    DockerCollectionDao = require("core/dao/docker-collection-dao").DockerCollectionDao,
    DockerContainerCreatorDao = require("core/dao/docker-container-creator-dao").DockerContainerCreatorDao,
    DockerContainerLogsDao = require("core/dao/docker-container-logs-dao").DockerContainerLogsDao,
    DockerImagePullDao = require("core/dao/docker-image-pull-dao").DockerImagePullDao,
    DockerContainerDao = require("core/dao/docker-container-dao").DockerContainerDao,
    DockerImageReadmeDao = require("core/dao/docker-image-readme-dao").DockerImageReadmeDao,
    DockerNetworkDao = require("core/dao/docker-network-dao").DockerNetworkDao,
    DockerContainerBridgeDao = require("core/dao/docker-container-bridge-dao").DockerContainerBridgeDao,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService;

exports.ContainerRepository = AbstractRepository.specialize({

    init: {
        value: function () {
            this._dockerContainerSectionDao = new DockerContainerSectionDao();
            this._dockerContainerDao = new DockerContainerDao();
            this._dockerImageDao = new DockerImageDao();
            this._dockerHostDao = new DockerHostDao();
            this._dockerConfigDao = new DockerConfigDao();
            this._dockerCollectionDao = new DockerCollectionDao();
            this._dockerContainerCreatorDao = new DockerContainerCreatorDao();
            this._dockerImagePullDao = new DockerImagePullDao();
            this._dockerContainerLogsRepository = new DockerContainerLogsDao();
            this._dockerContainerBridgeDao = new DockerContainerBridgeDao();
            this._modelDescriptorService = ModelDescriptorService.getInstance();
            this._dockerImageReadmeDao = new DockerImageReadmeDao();
            this._dockerNetworkDao = new DockerNetworkDao();
        }
    },

    getNewDockerNetwork: {
        value: function () {
            return this._dockerNetworkDao.getNewInstance();
        }
    },

    getNewDockerImage: {
        value: function () {
            return this._dockerImageDao.getNewInstance();
        }
    },

    getNewDockerContainer: {
        value: function () {
            return this._dockerImageDao.getNewInstance();
        }
    },

    getNewDockerCollection: {
        value: function () {
            return this._dockerCollectionDao.getNewInstance();
        }
    },

    getNewDockerContainerBridge: {
        value: function () {
            return this._dockerContainerBridgeDao.getNewInstance();
        }
    },

    getDockerImageReadme: {
        value: function () {
            return this._dockerImageReadmeDao.getNewInstance();
        }
    },

    getDockerImagesWithCollection: {
        value: function (collection) {
            return this._dockerCollectionDao.getImages(collection);
        }
    },

    getNewInstanceFromObjectType: {
        value: function(objectType) {
            if (objectType === 'DockerImage') {
                objectType = 'DockerImagePull';
            }
            return this._modelDescriptorService.getDaoForType(objectType).then(function(dao) {
                return dao.getNewInstance();
            });
        }
    },

    getNewInstanceRelatedToObjectModel: {
        value: function (object) {
            var modelType = object.constructor.Type;

            if (modelType === this._dockerContainerDao._model) {
                return this.getNewDockerContainerCreator();
            } else if (modelType === this._dockerImageDao._model) {
                return this.getNewImagePull();
            } else {
                return Promise.reject("Model object not supported")
            }
        }
    },

    getNewDockerContainerLogs: {
        value: function () {
            return this._dockerContainerLogsRepository.getNewInstance();
        }
    },

    getNewImagePull: {
        value: function () {
            return this._dockerImagePullDao.getNewInstance();
        }
    },

    getNewDockerContainerCreator: {
        value: function () {
            return this._dockerContainerCreatorDao.getNewInstance();
        }
    },

    getNewEmptyDockerContainerSectionList: {
        value: function() {
            return this._dockerContainerSectionDao.getEmptyList();
        }
    },

    getNewEmptyDockerContainerList: {
        value: function() {
            return this._dockerContainerDao.getEmptyList();
        }
    },

    getNewEmptyDockerCollectionList: {
        value: function() {
            return this._dockerCollectionDao.getEmptyList();
        }
    },

    getNewEmptyDockerImageList: {
        value: function() {
            return this._dockerImageDao.getEmptyList();
        }
    },

    getNewEmptyDockerHostList: {
        value: function() {
            return this._dockerHostDao.getEmptyList();
        }
    },

    getDockerContainerSettings: {
        value: function () {
            return this._dockerConfigDao.get();
        }
    },

    listDockerHosts: {
        value: function () {
            return this._dockerHostDao.list();
        }
    },

    listDockerNetworks: {
        value: function () {
            return this._dockerNetworkDao.list();
        }
    },

    listDockerContainers: {
        value: function () {
            return this._dockerContainerDao.list();
        }
    },

    listContainerSections: {
        value: function () {
            var self = this;

            return Promise.all([
                self.getNewEmptyDockerContainerSectionList(),
                //Add sub container sections here

                self.listDockerContainers(),
                self.listDockerHosts(),
                self.listDockerImages(),
                self.listDockerCollections(),
                self.listDockerNetworks()
            ]).then(function (data) {
                var containerSections = data[0];

                for (var i = 1, length = data.length; i < length; i++) {
                    containerSections.push(data[i]);
                }
                containerSections._objectType = 'DockerContainerSection';

                return containerSections;
            });
        }
    },

    listDockerImages: {
        value: function () {
            return this._dockerImageDao.list();
        }
    },

    listDockerCollections: {
        value: function () {
            return this._dockerCollectionDao.list();
        }
    },

    saveSettings: {
        value: function (settings) {
            return this._dockerConfigDao.save(settings);
        }
    },

    saveDockerNetwork: {
        value: function (dockerNetwork) {
            return this._dockerNetworkDao.save(dockerNetwork);
        }
    },

    saveContainer: {
        value: function (container) {
            return this._dockerContainerDao.save(container);
        }
    },

    getInteractiveConsoleToken: {
        value: function(containerId) {
            return this._dockerContainerDao.requestInteractiveConsole(containerId);
        }
    },

    getSerialConsoleToken: {
        value: function(containerId) {
            return this._dockerContainerDao.requestSerialConsole(containerId);
        }
    },

    startContainer: {
        value: function(container) {
            return this._dockerContainerDao.start(container);
        }
    },

    stopContainer: {
        value: function(container) {
            return this._dockerContainerDao.stop(container);
        }
    },

    getReadmeforDockerImage: {
        value: function(dockerImageName) {
            return this._dockerImageDao.readme(dockerImageName);
        }
    }
});
