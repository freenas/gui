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
            var self = this;
            return this._volumeService.decodePath(this._targetPath).then(function(pathComponents) {
                if (pathComponents[2].length > 0) {
                    self.object.target_type = 'DIRECTORY';
                    self.object.target_path = self._targetPath;
                } else {
                    self.object.target_type = 'DATASET';
                    self.object.target_path = pathComponents[1];
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
                        return value.replace(volumePathRegExp, self.EMPTY_STRING).replace(volumeIdRegExp, self.EMPTY_STRING);
                    },
                    revert: function(value) {
                        return datasetPath + value;
                    }
                };
                self.targetPath = self.targetPath+'';
            });
        }
    }
});
