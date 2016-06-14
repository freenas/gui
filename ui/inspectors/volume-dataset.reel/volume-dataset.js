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

    _object: {
        value: null
    },

    object: {
        get: function () {
            return this._object;
        },

        set: function (object) {
            this._object = object;
            this._loadVolume();
            this.datasetType = object.name === object.volume ? "root" : "child";
        }
    },

    volume: {
        value: null
    },

    datasetType: {
        value: null
    },

    _loadVolume: {
        value: function() {
            this.volume = this._getCurrentVolume();
            if (this._object && this.volume) {
                this._object.volume = this.volume.id;
            }
        }
    },

    _getCurrentVolume: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (Object.getPrototypeOf(currentSelection.path[i]).Type == Model.Volume) {
                        return currentSelection.path[i];
                    }
                }
            }
        }
    }
});
