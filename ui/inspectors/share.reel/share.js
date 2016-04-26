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

    _targetPath: {
        value: null
    },

    _loadingPromise: {
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
                        node.isDataset = self._isPathADataset(targetPath);
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
                    this.listChildren();
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
                this.application.dataService.fetchData(Model.Group).then(function(groups) {
                    self.groups = groups;
                });
                this.application.dataService.fetchData(Model.User).then(function(users) {
                    self.users = users;
                });
                if (object && this._filesystemService) {
                    if (object.target_path && object.target_type === 'DIRECTORY') {
                        this.targetPath = object.target_path
                    } else {
                        this.targetPath = '/mnt/' + (object.target_path ? object.target_path : object.volume.id);
                    }
                }
                this._object = object
            }
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            var self = this;
            if (isFirsttime) {
                this._filesystemService = this.application.filesystemService;
                this.application.dataService.fetchData(Model.User).then(function(users) {
                    self.users = users;
                });
                this._loadingPromise = this._loadVolumeService().then(function() {
                    self._loadPathConverter();
                });
                this._loadingPromise.then(function() {
                    if (self.object.target_path && self.object.target_type === 'DIRECTORY') {
                        self.targetPath = self.object.target_path
                    } else {
                        self.targetPath = '/mnt/' + (self.object.target_path ? self.object.target_path : self.object.volume.id);
                    }
                });
            }
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

            return this._addTargetTypeToObject().then(function () {
                self.application.dataService.saveDataObject(self.object);
            });
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
            return this._filesystemService.stat(path);
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
            return this._filesystemService.listDir(this._targetPathNode.path).then(function(children) {
                self.folders = children.filter(function(x) {
                    return x.type === 'DIRECTORY'
                }).map(function(x) {
                    x.isDataset = self._isPathADataset(self._filesystemService.join(self._targetPathNode.path, x.name));
                    return x;
                });
            });
        }
    }
});
