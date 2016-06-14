/**
 * @module ui/volume-dataset.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class VolumeDataset
 * @extends Component
 */
exports.VolumeDataset = Component.specialize(/** @lends VolumeDataset# */ {

    _object: {
        value: null
    },

    object: {
        get: function () {
            return this._object;
        },

        set: function (object) {
            this._object = object;
            this.datasetType = object.name === object.volume ? "root" : "child";
        }
    },

    datasetType: {
        value: null
    }
});
