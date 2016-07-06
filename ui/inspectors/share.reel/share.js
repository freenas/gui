var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    FileSystemController = require("core/controller/filesystem-tree-controller").FilesystemTreeController,
    DataSetTreeController = require("core/controller/dataset-tree-controller").DatasetTreeController,
    application = require("montage/core/application").application;

/**
 * @class Share
 * @extends Component
 */
exports.Share = Component.specialize({
    EMPTY_STRING: {
        value: ''
    },

    LINE_START: {
        value: '^'
    },

    filesystemService: {
        value: null
    },

    _volumeService: {
        value: null
    },


    _loadingPromise: {
        value: null
    },

    _folders: {
        value: null
    },

    folder: {
        get: function() {
            return this._folders;
        },
        set: function(folders) {
            if (this._folders != folders) {
                this._folders = folders;
            }
        }
    },

    _targetPath: {
        value: null
    },

    targetPath: {
        get: function() {
            return this._targetPath;
        },
        set: function(targetPath) {
            if (this._targetPath != targetPath) {
                this._targetPath = targetPath;
                if (this.targetController && targetPath != this.targetController.selectedPath) {
                    this.targetController.open(targetPath);
                }
            }
        }
    },

    pathConverter: {
        value: null
    },

    _service: {
        value: null
    },

    service: {
        get: function() {
            return this._service;
        },
        set: function(service) {
            if (this._service != service) {
                this._service = service;
            }
            this.isServiceStarted = service.config.enable;
        }
    },

    _isServiceStarted: {
        value: null
    },

    isServiceStarted: {
        get: function() {
            return this._isServiceStarted;
        },
        set: function(isServiceStarted) {
            if (this._isServiceStarted !== isServiceStarted) {
                if (isServiceStarted) {
                    this._startService();
                } else {
                    this._stopService();
                }
                this._isServiceStarted = isServiceStarted;
            }
        }
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            var self = this;
            if (this._object !== object) {
                if (object) {

                    this._getService(object).then(function (service) {
                        self.service = service;
                        self.isServiceStarted = service.state == 'RUNNING';
                    });
                    if (!object.target_path) {
                        object.target_path = '/mnt/' + object.volume.id;
                    }
                    if (!object.target_type) {
                        var shareServiceConstructor = this.application.shareService.constructor;

                        object.target_type = object.type === shareServiceConstructor.SHARE_TYPES.ISCSI ?
                            shareServiceConstructor.TARGET_TYPES.ZVOL :
                            shareServiceConstructor.TARGET_TYPES.DATASET;
                    }

                    this.targetPath = object.target_path;
                    this.targetType = object.target_type;
                }

                this._object = object;
                this._updateTargetController();
                this.dispatchOwnPropertyChange("targetController", this.targetController);
            }
        }
    },

    isDatasetMode: {
        get: function () {
            return this.targetType === this.application.shareService.constructor.TARGET_TYPES.DATASET;
        }
    },

    _targetType: {
        value: null
    },

    targetType: {
        set: function (targetType) {
            if (this._targetType !== targetType) {
                this._targetType = targetType;
                this._updateTargetController();
            }
        },
        get: function () {
            return this._targetType;
        }
    },

    _datasetsPaths: {
        value: null
    },

    datasetsPaths: {
        set: function (datasetsPaths) {
            if (this._datasetsPaths !== datasetsPaths) {
                this._datasetsPaths = datasetsPaths;
                this._updateTargetController();
            }
        },
        get: function () {
            return this._datasetsPaths;
        }
    },

    _volumePath: {
        value: null
    },

    volumePath: {
        set: function (volumePath) {
            if (this._volumePath !== volumePath) {
                this._volumePath = volumePath;
                this._updateTargetController();
            }
        },
        get: function () {
            return this._volumePath;
        }
    },

    targetController: {
        get: function () {
            if (this.object) {
                return this.object.type === this.application.shareService.constructor.SHARE_TYPES.ISCSI ?
                    this.dataSetTreeController : this.fileSystemController;
            }
        }
    },

    _fileSystemController: {
        value: null
    },

    fileSystemController: {
        get: function () {
            if (!this._fileSystemController) {
                this._fileSystemController = new FileSystemController();
                this._fileSystemController.canListFiles = false;
                this._fileSystemController.service = application.filesystemService;
            }

            return this._fileSystemController;
        }
    },

    _dataSetTreeController: {
        value: null
    },

    dataSetTreeController: {
        get: function () {
            if (!this._dataSetTreeController) {
                this._dataSetTreeController = new DataSetTreeController();
                this._dataSetTreeController.canListFiles = false;
                this._dataSetTreeController.service = application.dataService;
            }

            return this._dataSetTreeController;
        }
    },

    _updateTargetController: {
        value: function () {
            if (this.targetController) {
                if (this.targetController === this._dataSetTreeController) {
                    this._dataSetTreeController.root = this.object ? this.object.volume.id : null;
                } else if (this.targetController === this._fileSystemController) {
                    this._fileSystemController.root = this.volumePath;
                    this._fileSystemController.isDatasetMode = this.isDatasetMode;
                    this._fileSystemController.datasetsPaths = this.datasetsPaths;
                }
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._loadVolumeService();
                this._shareService = this.application.shareService;
            }

            //todo: block draw
            this._shareService.populateShareObjectIfNeeded(this.object);

            this.targetPath = this.object.target_path;
            this.targetType = this.object.target_type;
        }
    },

    exitDocument: {
        value: function() {
            this.targetPath = null;
        }
    },

    save: {
        value: function() {
            var self = this;
            this.object.target_path = this.targetController.selectedPath;
            this.object.target_type = this.targetType;

            return this._shareService.save(this.object).then(function() {
                self.isServiceStarted = true;
            });
        }
    },

    _loadVolumeService: {
        value: function() {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.Volume).then(function(Volume) {
                self._volumeService = Volume.constructor.services;
            });
        }
    },

    _getService: {
        value: function(object) {
            var serviceName = 'service-' + object.type;
            return this.application.dataService.fetchData(Model.Service).then(function(services) {
                return services.filter(function (x) { return x.config && x.config.type == serviceName; })[0];
            });
        }
    },

    _startService: {
        value: function() {
            if (this.service && this.service.config && !this.service.config.enable) {
                this.service.config.enable = true;
                this.application.dataService.saveDataObject(this.service);
            }
        }
    },

    _stopService: {
        value: function() {
            if (this.service && this.service.config && this.service.config.enable) {
                this.service.config.enable = false;
                this.application.dataService.saveDataObject(this.service);
            }
        }
    }

});
