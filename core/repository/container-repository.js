var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    DockerContainerSectionDao = require("core/dao/docker-container-section-dao").DockerContainerSectionDao,
    DockerImageDao = require("core/dao/docker-image-dao").DockerImageDao,
    DockerHostDao = require("core/dao/docker-host-dao").DockerHostDao,
    DockerConfigDao = require("core/dao/docker-config-dao").DockerConfigDao,
    DockerCollectionDao = require("core/dao/docker-collection-dao").DockerCollectionDao,
    DockerContainerDao = require("core/dao/docker-container-dao").DockerContainerDao;

exports.ContainerRepository = AbstractRepository.specialize({

    init: {
        value: function (dockerContainerSectionDao, dockerContainerDao, dockerImageDao, dockerHostDao, dockerConfigDao, dockerCollectionDao) {
            this._dockerContainerSectionDao = dockerContainerSectionDao || DockerContainerSectionDao.instance;
            this._dockerContainerDao = dockerContainerDao || DockerContainerDao.instance;
            this._dockerImageDao = dockerImageDao || DockerImageDao.instance;
            this._dockerHostDao = dockerHostDao || DockerHostDao.instance;
            this._dockerConfigDao = dockerConfigDao || DockerConfigDao.instance;
            this._dockerCollectionDao = dockerCollectionDao || DockerCollectionDao.instance;
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

                self.getNewEmptyDockerContainerList(),
                self.getNewEmptyDockerHostList(),
                self.getNewEmptyDockerImageList(),
                self.getNewEmptyDockerCollectionList()
            ]).then(function (data) {
                var containerSections = data[0];

                for (var i = 1, length = data.length; i < length; i++) {
                    containerSections.push(data[i]);
                }

                return containerSections;
            });
        }
    },

    listDockerImages: {
        value: function () {
            return this._dockerImageDao.list();
        }
    },

    saveSettings: {
        value: function (settings) {
            return this._dockerConfigDao.save(settings);
        }
    },

    saveContainer: {
        value: function (container) {
            return this._dockerContainerDao.save(container);
        }
    }

});
