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

    _targetType: {
        value: null
    },

    targetType: {
        get: function() {
            return this._targetType;
        },
        set: function(targetType) {
            if (this._targetType !== targetType) {
                this._targetType = this._object.target_type = targetType;
                this._openTreeController();
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
            if (this._service !== service) {
                this._service = service;

                if (service) {
                    this.isServiceStarted = service.config.enable;
                }
            }
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

                    if (!object.volume) {
                        console.error("@Pierre: Fixme");
                    }

                    this._getService(object).then(function (service) {
                        self.service = service;
                        self.isServiceStarted = service.state == 'RUNNING';
                    });
                    
                    var shareServiceConstructor = this.application.shareService.constructor;
                    if (!object.target_type) {
                        object.target_type = object.type === shareServiceConstructor.SHARE_TYPES.ISCSI ?
                            shareServiceConstructor.TARGET_TYPES.ZVOL :
                            shareServiceConstructor.TARGET_TYPES.DATASET;
                    }

                    this.isPathReadOnly = !object._isNew && 
                                            (object.target_type == shareServiceConstructor.TARGET_TYPES.DATASET ||
                                             object.target_type == shareServiceConstructor.TARGET_TYPES.ZVOL);
                }

                this._object = object;
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this._loadVolumeService();
                this._shareService = this.application.shareService;
            }

            //todo: block draw
            this._shareService.populateShareObjectIfNeeded(this.object).then(function() {
                self.targetType = self._object.target_type;
                if (!self._object.target_path) {
                    self._openTreeController();
                }
            });

        }
    },

    save: {
        value: function() {
            var self = this;
            return this._shareService.save(this.object).then(function() {
                self.isServiceStarted = true;

            }, function(err) {
                self._object.target_path = self.treeControllers[self.targetType].selectedPath;
                throw err;
            });
        }
    },

    _openTreeController: {
        value: function() {
            if (this.targetType) {
                var self = this,
                    treeController = this.treeControllers[this.targetType];
                treeController.open().then(function() {
                    self._object.target_path = treeController.selectedPath;
                });
            }
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
