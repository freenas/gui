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

    _filesystemService: {
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
            var self = this;
            if (this._targetPath != targetPath) {
                if (targetPath) {
                    self._targetPath = targetPath;
                    self.getPathNode(targetPath).then(function(node) {
                        if (node) {
                            node.isDataset = self._isPathADataset(targetPath);
                        } else {
                            node = {
                                name: self._filesystemService.dirname(targetPath),
                                path: targetPath,
                                isDataset: true
                            };
                        }
                        self.targetPathNode = node;
                    });
                }

            }
        }
    },

    _targetPathNode: {
        value: null
    },

    targetPathNode: {
        get: function() {
            return this._targetPathNode;
        },
        set: function(targetPathNode) {
            if (this._targetPathNode != targetPathNode) {
                this._targetPathNode = targetPathNode;
                if (targetPathNode && targetPathNode.path) {
                    if (!this._targetType) {
                        this.targetType = this.object.target_type || targetPathNode.isDataset ? 'DATASET' : 'DIRECTORY';
                    }
                    this.listChildren();
                }
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
            if (this._targetType != targetType) {
                this._targetType = targetType;
                if (targetType == 'DATASET' && this._targetPathNode && !this._targetPathNode.isDataset) {
                    this._targetPath = this.datasetToPathConverter.convert(this.object.volume.id)
                }
            }
        }
    },

    users: {
        value: []
    },

    groups: {
        value: []
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
            this.isServiceStarted = this._isServiceRunning();
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
                if (isServiceStarted && !this._isServiceRunning()) {
                    this._startService();
                } else if (!isServiceStarted && this._isServiceRunning()) {
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
            this._loadUsers();
            this._loadGroups();
            if (this._object != object) {
                if (object) {
                    this._getService(object).then(function (service) {
                        self.service = service;
                        self.isServiceStarted = service.state == 'RUNNING';
                    });
                    if (this._filesystemService) {
                        if (object.target_path && object.target_type === 'DIRECTORY') {
                            this.targetPath = object.target_path
                        } else {
                            this.targetPath = this.datasetToPathConverter.convert(object.target_path ? object.target_path : object.volume.id);
                        }
                    }
                    if (!object.target_type) {
                        object.target_type = 'DATASET';
                    }
                    this.targetType = object.target_type;
                }
                this._object = object
            }
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            var self = this;
            this._loadUsers();
            this._loadGroups();
            if (isFirsttime) {
                this._filesystemService = this.application.filesystemService;
                this._loadingPromise = this._loadVolumeService().then(function() {
                    self._loadPathConverter();
                });
            }
            this._loadingPromise.then(function() {
                if (self.object.target_path && self.object.target_type === 'DIRECTORY') {
                    self.targetPath = self.object.target_path
                } else {
                    self.targetPath = self.datasetToPathConverter.convert(self.object.target_path ? self.object.target_path : self.object.volume.id);
                }
                self.targetType = self.object.target_type;
            });
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

            this._setTargetPathOnObject();
            this.object.target_type = this._targetType;

            return self.application.dataService.saveDataObject(self.object).then(function() {
                self.isServiceStarted = true;
            });
        }
    },

    _loadUsers: {
        value: function() {
            var self = this;
            if (!this.users || this.users.length == 0) {
                this.application.dataService.fetchData(Model.User).then(function(users) {
                    self.users = users;
                });
            }
        }
    },

    _loadGroups: {
        value: function() {
            var self = this;
            if (!this.groups || this.groups.length == 0) {
                this.application.dataService.fetchData(Model.Group).then(function(groups) {
                    self.groups = groups;
                });
            }
        }
    },

    _setTargetPathOnObject: {
        value: function() {
            var path = this._targetPath;
            if (this._targetType == 'DATASET') {
                if (this.object._isNewObject) {
                    path += '/' + this.object.name;
                }
                path = this.datasetToPathConverter.revert(path);
            }
            this.object.target_path = path;
        }
    },

    _addTargetTypeToObject: {
        value: function() {
            var self = this,
                targetPath = this._targetPath || this.pathConverter.revert(this.object.name),
                basename = this._filesystemService.basename(targetPath),
                isDatasetPromise;

            if (!this.object.target_type) {
                return this._filesystemService.listDir(this._filesystemService.dirname(targetPath)).then(function(children) {
                    if (children.filter(function(x) { return x.name == basename }).length > 0) {
                        isDatasetPromise = self._volumeService.decodePath(targetPath).then(function(pathComponents) {
                            return pathComponents[2].length == 0;
                        });
                    } else {
                        isDatasetPromise = Promise.resolve(true)
                    }
                    return isDatasetPromise;
                }).then(function(isDataset) {
                    if (isDataset) {
                        return self._volumeService.decodePath(targetPath).then(function(pathComponents) {
                            self.object.target_type = 'DATASET';
                            self.object.target_path = self._filesystemService.join(pathComponents[1], pathComponents[2]);
                        });
                    } else {
                        self.object.target_type = 'DIRECTORY';
                        self.object.target_path = targetPath;
                        return null;
                    }
                });
            } else {
                return Promise.resolve();
            }
        }
    },

    _loadVolumeService: {
        value: function() {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.Volume).then(function(Volume) {
                self._volumeService = Volume.constructor;
            });
        }
    },

    _loadPathConverter: {
        value: function() {
            var self = this;
            return this._volumeService.getDatasetPath(this.object.volume.id).then(function(datasetPath) {
                var volumeIdRegExp = new RegExp(self.LINE_START+self.object.volume.id),
                    volumePathRegExp = new RegExp(self.LINE_START+datasetPath);
                self.pathConverter = {
                    convert: function(value) {
                        var result = value.replace(volumePathRegExp, self.EMPTY_STRING).replace(volumeIdRegExp, self.EMPTY_STRING);
                        if (self.object.target_type) {
                            result = '/' + result;
                        }
                        return result.replace('//', '/');
                    },
                    revert: function(value) {
                        return [datasetPath, value].join('/').replace('//', '/');
                    }
                };
                self.targetPath = self.targetPath+'';
            });
        }
    },

    getPathNode: {
        value: function(path) {
            return this._filesystemService.stat(path).then(function(stat) {
                return stat;
            }, function() {
                return {
                    path: path
                };
            });
        }
    },

    _isPathADataset: {
        value: function (path) {
            return this.datasetsPath.indexOf(path) != -1;
        }
    },

    listChildren: {
        value: function() {
            var self = this;
            return this._filesystemService.listDir(this._targetPath).then(function(children) {
                self.folders = children.filter(function(x) {
                    return x.type === 'DIRECTORY'
                }).map(function(x) {
                    x.isDataset = self._isPathADataset(self._filesystemService.join(self._targetPath, x.name));
                    return x;
                });
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

    _isServiceRunning: {
        value: function() {
            return this.service && this.service.state == 'RUNNING';
        }
    },

    _startService: {
        value: function() {
            var self = this;
            if (this.service && !this._isServiceRunning()) {
                this.service.manage(this.service.id, 'start');
            }
        }
    },

    _stopService: {
        value: function() {
            var self = this;
            if (this.service && this._isServiceRunning()) {
                this.service.manage(this.service.id, 'stop');
            }
        }
    }
});
