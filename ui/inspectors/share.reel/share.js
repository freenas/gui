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
                self._targetPath = targetPath;
            }
        }
    },

    pathConverter: {
        value: null
    },

    enterDocument: {
        value: function(isFirsttime) {
            var self = this;
            if (isFirsttime) {
                this._filesystemService = this.application.filesystemService;
                this._loadingPromise = this._loadVolumeService().then(function() {
                    self._loadPathConverter();
                });
            }
            this._loadingPromise.then(function() {
                self.targetPath = self.object.target_path || '';
            });
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
    }
});
