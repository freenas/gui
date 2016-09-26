var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    FileSystemController = require("core/controller/filesystem-tree-controller").FilesystemTreeController,
    DataSetTreeController = require("core/controller/dataset-tree-controller").DatasetTreeController,
    application = require("montage/core/application").application,
    ShareService = require("core/service/share-service").ShareService;

/**
 * @class Share
 * @extends Component
 */
exports.Share = AbstractInspector.specialize({
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
                    this.serviceEnabled = service.config.enable;
                }
            }
        }
    },

    serviceEnabled: {
        value: null
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
                        self.serviceEnabled = service.state == 'RUNNING';
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

                // trigger content change
                this.dispatchOwnPropertyChange("possibleTargetTypes", this.possibleTargetTypes);
            }
        }
    },

    _targetType: {
        value: null
    },

    targetType: {
        set: function (targetType) {
            if (this._targetType !== targetType) {
                this._targetType = targetType;

                if (this._object.target_type !== targetType) {
                    this._object.target_type = targetType;
                    this._openTreeController();
                }

                // triggers icon update
                this.dispatchOwnPropertyChange("iconModuleId", this.iconModuleId);
            }
        },
        get: function () {
            return this._targetType;
        }
    },

    possibleTargetTypes: {
        get: function () {
            //not using the global object ShareService in order to avoid to create a closure.
            return !this.object || this.object.type !== this.application.shareService.constructor.SHARE_TYPES.ISCSI ?
                this.constructor.POSSIBLE_TARGET_TYPES.DEFAULT : this.constructor.POSSIBLE_TARGET_TYPES.ISCSI;
        }
    },


    enterDocument: {
        value: function(isFirstTime) {
            this.$super.enterDocument(isFirstTime);
            var self = this;
            if (isFirstTime) {
                this._loadVolumeService();
                this._shareService = this.application.shareService;
            }

            this.volume = this._getCurrentVolume();

            //todo: block draw
            this._shareService.populateShareObjectIfNeeded(this.object).then(function() {
                self.targetType = self._object.target_type;
                if (self._object._isNew) {
                    self._openTreeController();
                }
            });

        }
    },

    save: {
        value: function() {
            var self = this;
            if (this.object._isNew) {
                this.isPathReadOnly = true;
            }
            return this._shareService.save(this.object).then(function() {
                if (self.serviceEnabled !== self.service.config.enable) {
                    if (self.serviceEnabled) {
                        self._startService();
                    } else {
                        self._stopService();
                    }
                }
                if (self.object._isNew) {
                    self.isPathReadOnly = false;
                }
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

    _getCurrentVolume: {
        value: function() {
            if (this.context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = currentSelection.path.length - 1; i >= 0; i--) {
                    if (currentSelection.path[i].constructor.Type == Model.Volume) {
                        return currentSelection.path[i];
                    }
                }
            }
        }
    },

    revert: {
        value: function() {
            var self = this,
                shareService = this.application.shareService,
                promise;
            if (!this.object._isNew) {
                return this.inspector.revert();
            } else {
                switch (this._object.type) {
                    case this.application.shareService.constructor.SHARE_TYPES.SMB:
                        promise = shareService.createSmbShare(this._object.volume);
                        break;
                    case this.application.shareService.constructor.SHARE_TYPES.NFS:
                        promise = shareService.createNfsShare(this._object.volume);
                        break;
                    case this.application.shareService.constructor.SHARE_TYPES.AFP:
                        promise = shareService.createAfpShare(this._object.volume);
                        break;
                    case this.application.shareService.constructor.SHARE_TYPES.ISCSI:
                        promise = shareService.createIscsiShare(this._object.volume);
                        break;
                }
                return promise.then(function(share) {
                    return shareService.populateShareObjectIfNeeded(share);
                }).then(function(share) {
                    self._deepCopy(share, self.object);
                    self.object.target_type = self.targetType;
                    self._openTreeController();
                });
            }
        }
    },

    _deepCopy: {
        value: function(source, target) {
            var keys = Object.keys(target),
                key, property;
            for (var i = 0, length = keys.length; i < length; i++) {
                key = keys[i];
                if (key.indexOf('_') == 0 && typeof target[key.substr(1)] !== 'undefined') {
                    key = key.substr(1);
                }
                property = source[key];
                if (property && typeof property === 'object' && !Array.isArray(property)) {
                    this._deepCopy(property, target[key]);
                } else if (typeof target[key] === 'boolean') {
                    target[key] = !!property;
                } else {
                    target[key] = property;
                }
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
},{
    POSSIBLE_TARGET_TYPES: {
        value: {
            DEFAULT: [ShareService.TARGET_TYPES.DATASET, ShareService.TARGET_TYPES.DIRECTORY],
            ISCSI: [ShareService.TARGET_TYPES.ZVOL, ShareService.TARGET_TYPES.FILE]
        }
    }
});
