/**
 * @module ui/volume-dataset.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class VolumeDataset
 * @extends Component
 */
exports.VolumeDataset = Component.specialize(/** @lends VolumeDataset# */ {

    TYPE_OPTIONS: {
        value: [
            {label: "FILESYSTEM", value: "FILESYSTEM"},
            {label: "ZVOL", value: "VOLUME"}
        ]
    },

    context: {
        get: function() {
            return this._context;
        },
        set: function(context) {
            if (this._context != context) {
                this._context = context;
            }
            this._loadVolume();
        }
    },

    volume: {
        value: null
    },

    datasetLevel: {
        value: null
    },

    name: {
        value: null
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

    enterDocument: {
        value: function(isFirstTime) {
            var storageService = this.application.storageService;
            this._loadVolume();
            this.datasetLevel = storageService.isRootDataset(this.object) ? "root" : "child";
            if (this.object._isNew) {
                this.object.type = "FILESYSTEM";
            }
            storageService.initializeDatasetProperties(this.object);
        }
    },

    _loadVolume: {
        value: function() {
            this.volume = this._getCurrentVolume();
            if (this.object && this.volume) {
                this.object.volume = this.targetPath = this.volume.id;
            }
        }
    },

    _getCurrentVolume: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (currentSelection.path[i].constructor.Type == Model.Volume) {
                        return currentSelection.path[i];
                    }
                }
            }
        }
    },

    save: {
        value: function() {
            if (this.object.type === "FILESYSTEM") {
                this.object.properties.volblocksize = undefined;
            }
            this.object.id = this.filesystemTreeController.selectedPath + "/" + this.name;
            this.application.storageService.convertVolumeDatasetSizeProperties(this.object);
            this.application.dataService.saveDataObject(this.object);
        }
    }
});
