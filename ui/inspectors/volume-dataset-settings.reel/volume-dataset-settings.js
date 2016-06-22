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

    compressionSetting: {
        set: function(value) {
            if (this.object) {
                this.object.compression = this._setInheritableProperty(value);
            } else {
                console.warn("Object not yet set!");
            }
        },

        get: function() {
            return this.object ? this._getInheritableProperty(this.object.compression) : "";
        }
    },

    dedupSetting: {
        set: function(value) {
            if (this.object) {
                this.object.dedup = this._setInheritableProperty(value);
            } else {
                console.warn("Object not yet set!");
            }
        },

        get: function() {
            return this.object ? this._getInheritableProperty(this.object.dedup) : "";
        }
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
    },

    _setInheritableProperty: {
        value: function(value) {
            var newDatasetProperty = {};
            newDatasetProperty.source = value === "none" ? "INHERITED" : "LOCAL";
            newDatasetProperty.parsed = value === "none" ? null : value;
            return newDatasetProperty;
        }
    },

    _getInheritableProperty: {
        value: function(datasetProperty) {
            if (datasetProperty.source === "INHERITED" || datasetProperty.parsed === null) {
                return "none";
            } else {
                return datasetProperty.parsed;
            }
        }
    }
});
