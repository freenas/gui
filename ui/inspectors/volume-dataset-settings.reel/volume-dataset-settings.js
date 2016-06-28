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

    VOLBLOCKSIZE_OPTIONS: {
        value: [
            {label: "512", value: 512},
            {label: "1024", value: 1024},
            {label: "2048", value: 2048},
            {label: "4096", value: 4096}
        ]
    },

    datasetLevel: {
        value: null
    },

    datasetType: {
        value: null
    },

    compressionSetting: {
        set: function(value) {
            if (this.object && this.object.properties) {
                this.object.properties.compression = this._setInheritableProperty(value);
            } else {
                console.warn("Object not yet set!");
            }
        },

        get: function() {
            return this.object.properties ? this._getInheritableProperty(this.object.properties.compression) : "none";
        }
    },

    dedupSetting: {
        set: function(value) {
            if (this.object && this.object.properties) {
                this.object.properties.dedup = this._setInheritableProperty(value);
            } else {
                console.warn("Object not yet set!");
            }
        },

        get: function() {
            return this.object.properties ? this._getInheritableProperty(this.object.properties.dedup) : "none";
        }
    },
    enterDocument: {
        value: function(isFirstTime) {
            var storageService = this.application.storageService;
            if (isFirstTime) {
                this.datasetLevel = storageService.isRootDataset(this.object) ? "root" : "child";
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
                if (optionValues[i] === "null" || optionValues[i] === null) {
                    option.value = "none";
                    if (this.datasetLevel === "child") {
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
