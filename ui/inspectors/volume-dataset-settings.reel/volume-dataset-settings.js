/**
 * @module ui/volume-dataset-settings.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class VolumeDatasetSettings
 * @extends Component
 */
exports.VolumeDatasetSettings = Component.specialize(/** @lends VolumeDatasetSettings# */ {

    COMPRESSION_OPTIONS: {
        value: [
            "on",
            "off",
            "lzjb",
            "zle",
            "lz4",
            "gzip",
            "gzip-1",
            "gzip-2",
            "gzip-3",
            "gzip-4",
            "gzip-5",
            "gzip-6",
            "gzip-7",
            "gzip-8",
            "gzip-9"
        ]
    },

    DEDUP_OPTIONS: {
        value: [
            "on",
            "off",
            "verify",
            "sha256",
            "sha256,verify",
            "sha512",
            "sha512,verify",
            "skein",
            "skein,verify",
            "edonr,verify"
        ]
    },

    ATIME_OPTIONS: {
        value: [
            "on",
            "off"
        ]
    },

    object: {
        value: null
    },

    datasetType: {
        value: null
    }
});
