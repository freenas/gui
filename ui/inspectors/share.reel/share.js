var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise;

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
                if (this.filesystemTreeController && targetPath != this.filesystemTreeController.selectedPath) {
                    this.filesystemTreeController.open(targetPath);
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
            if (this._object != object) {
                if (object) {
                    this._getService(object).then(function (service) {
                        self.service = service;
                        self.isServiceStarted = service.state == 'RUNNING';
                    });
                    if (!object.target_path) {
                        object.target_path = '/mnt/' + object.volume.id;
                    }
                    if (!object.target_type) {
                        object.target_type = 'DATASET';
                    }
                    this._ensureDefaultPermissionsAreSet(object);
                    this.targetPath = object.target_path;
                    this.targetType = object.target_type;
                }
                this._object = object
            }
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            if (isFirsttime) {
                this._loadVolumeService();
            }

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

            if (this.object.type === 'nfs') {
                var properties = this.object.properties;
                properties.maproot_user = properties.maproot_user != ' - ' ? properties.maproot_user : null;
                properties.maproot_group = properties.maproot_group != ' - ' ? properties.maproot_group : null;
                properties.mapall_user = properties.mapall_user != ' - ' ? properties.mapall_user : null;
                properties.mapall_group = properties.mapall_group != ' - ' ? properties.mapall_group : null;
            }

            this.object.target_path = this.filesystemTreeController.selectedPath;
            if (this.object._isNewObject && this.targetType == 'DATASET') {
                this.object.target_path += '/' + this.object.name;
            }

            this.object.target_type = this.targetType;

            return self.application.dataService.saveDataObject(self.object).then(function() {
                self.isServiceStarted = true;
            });
        }
    },

    _ensureDefaultPermissionsAreSet: {
        value: function(object) {
            if (!object.permissions || !object.permissions.user || !object.permissions.group) {
                var permissionsPromise = object.permissions ? Promise.resolve(object.permissions) : self.application.dataService.getNewInstanceForType(Model.Permissions);
                permissionsPromise.then(function(permissions) {
                    if (!permissions.user) {
                        permissions.user = 'root';
                    }
                    if (!permissions.group) {
                        permissions.group = 'wheel';
                    }
                    object.permissions = permissions;
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
            var self = this;
            if (this.service && this.service.config && !this.service.config.enable) {
                this.service.config.enable = true;
                this.application.dataService.saveDataObject(this.service);
            }
        }
    },

    _stopService: {
        value: function() {
            var self = this;
            if (this.service && this.service.config && this.service.config.enable) {
                this.service.config.enable = false;
                this.application.dataService.saveDataObject(this.service);
            }
        }
    }
});
