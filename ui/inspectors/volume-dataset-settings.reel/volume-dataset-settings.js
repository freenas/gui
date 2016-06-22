/**
 * @module ui/volume-dataset-settings.reel
 */
var Component = require("montage/ui/component").Component,
    COMPRESSION_OPTIONS = require("core/model/enumerations/volume-dataset-property-compression-value").VolumeDatasetPropertyCompressionValue,
    DEDUP_OPTIONS = require("core/model/enumerations/volume-dataset-property-dedup-value").VolumeDatasetPropertyDedupValue;

/**
 * @class VolumeDatasetSettings
 * @extends Component
 */
exports.VolumeDatasetSettings = Component.specialize(/** @lends VolumeDatasetSettings# */ {

    compressionOptions: {
        value: null
    },

    dedupOptions: {
        value: null
    },

    ATIME_OPTIONS: {
        value: [
            "on",
            "off"
        ]
    },

    datasetType: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.compressionOptions = this._intializeInheritablePropertyOptions(COMPRESSION_OPTIONS);
                this.dedupOptions = this._intializeInheritablePropertyOptions(DEDUP_OPTIONS);
            }
        }
    },

    _intializeInheritablePropertyOptions: {
        value: function(optionEnum) {
            var optionValues = Object.keys(optionEnum),
                options = [],
                option;
            for (var i = 0, length = optionValues.length; i < length; i++) {
                option = {};
                console.log(optionValues[i], typeof optionValues[i])
                if (optionValues[i] === "null" || optionValues[i] === null) {
                    option.value = "none";
                    if (this.datasetType === "child") {
                        option.label = "Inherit";
                    } else {
                        option.label = "Reset to Default";
                    }
                } else {
                    option.label = option.value = optionValues[i];
                }
                options.push(new Object(option));
            }
            return options;
        }
    }
});
