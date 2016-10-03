/**
 * @module ui/volume-dataset-settings.reel
 */
var Component = require("montage/ui/component").Component,
    COMPRESSION_OPTIONS = require("core/model/enumerations/volume-dataset-property-compression-value").VolumeDatasetPropertyCompressionValue,
    DEDUP_OPTIONS = require("core/model/enumerations/volume-dataset-property-dedup-value").VolumeDatasetPropertyDedupValue,
    VOLBLOCKSIZE_OPTIONS = require("core/model/enumerations/volume-dataset-property-volblocksize-value").VolumeDatasetPropertyVolblocksizeValue;

var ATIME_OPTIONS = {on: true, off: false, null: null},
    DEFAULT_OPTION = { label: "Default", value: "none"},
    INHERIT_OPTION = { label: "Inherit", value: "none"};

/**
 * @class VolumeDatasetSettings
 * @extends Component
 */
exports.VolumeDatasetSettings = Component.specialize(/** @lends VolumeDatasetSettings# */ {

    volblocksizeDisplayMode: {
        value: null
    },

    _compression: {
        value: null
    },

    compression: {
        get: function() {
            return this._compression;
        },
        set: function(compression) {
            if (this._compression !== compression) {
                this._compression = compression;

                if (this._canUpdateObjectProperty('compression') && this.object.properties.compression.parsed !== compression) {
                    this.object.properties.compression.source = this._getPropertySourceFromValue(compression);
                    this.object.properties.compression.parsed = this.object.properties.compression.source === "INHERITED" ? null : compression;
                }
            }
        }
    },

    _dedup: {
        value: null
    },

    dedup: {
        get: function() {
            return this._dedup;
        },
        set: function(dedup) {
            if (this._dedup !== dedup) {
                this._dedup = dedup;

                if (this._canUpdateObjectProperty('dedup') && this.object.properties.dedup.parsed !== dedup) {
                    this.object.properties.dedup.source = this._getPropertySourceFromValue(dedup);
                    this.object.properties.dedup.parsed = this.object.properties.dedup.source === "INHERITED" ? null : dedup;
                }
            }
        }
    },

    _atime: {
        value: null
    },

    atime: {
        get: function() {
            return this._atime;
        },
        set: function(atime) {
            if (this._atime !== atime) {
                this._atime = atime;

                if (this._canUpdateObjectProperty('atime') && this.object.properties.atime.parsed !== atime) {
                    this.object.properties.atime.source = this._getPropertySourceFromValue(atime);
                    this.object.properties.atime.parsed = this.object.properties.atime.source === "INHERITED" ? null : atime;
                }
            }
        }
    },

    templateDidLoad: {
        value: function() {

            this.compressionOptions = this._initializePropertyOptions(COMPRESSION_OPTIONS);
            this.dedupOptions = this._initializePropertyOptions(DEDUP_OPTIONS);
            this.atimeOptions = this._initializePropertyOptions(ATIME_OPTIONS);
            this.volblocksizeOptions = this._initializePropertyOptions(VOLBLOCKSIZE_OPTIONS);
        }
    },

    enterDocument: {
        value: function() {
            this._isLoaded = false;
            this.isRootDataset = this.application.storageService.isRootDataset(this.object);
            var label = this.isRootDataset ? "Default": "Inherit";
            this._replaceLabel(this.compressionOptions, label);
            this._replaceLabel(this.dedupOptions, label);
            this._replaceLabel(this.atimeOptions, label);
            if (this.object.properties) {
                this.compression = (!this.object.properties.compression || this._isInheritedProperty(this.object.properties.compression)) ? "none": this.object.properties.compression.parsed;
                this.dedup = (!this.object.properties.dedup || this._isInheritedProperty(this.object.properties.dedup)) ? "none": this.object.properties.dedup.parsed;
                this.atime = (!this.object.properties.atime || this._isInheritedProperty(this.object.properties.atime)) ? "none": this.object.properties.atime.parsed;
            }
            this.volblocksizeDisplayMode = this.object._isNew ? "edit" : "display";
            this._isLoaded = true;
        }
    },

    exitDocument: {
        value: function() {
            this._isLoaded = false;
            this.compression = null;
            this.dedup = null;
            this.atime = null;
        }
    },

    _replaceLabel: {
        value: function(list, label) {
            var entry;
            for (var i = 0, length = list.length; i < length; i++) {
                entry = list[i];
                if (entry.value === "none") {
                    entry.label = label;
                    break;
                }
            }
        }
    },

    _canUpdateObjectProperty: {
        value: function(propertyName) {
            return this._isLoaded && this.object && this.object.properties && this.object.properties[propertyName];
        }
    },

    _initializePropertyOptions: {
        value: function(optionEnum, isRoot) {
            var keys = Object.keys(optionEnum), key,
                options = [], option;
            for (var i = 0, length = keys.length; i < length; i++) {
                key = keys[i];
                option = {};
                if (key === "null" || key === null) {
                    option.value = "none";
                } else {
                    option.label = key;
                    option.value = optionEnum[key];
                }
                options.push(new Object(option));
            }
            return options;
        }
    },

    _isInheritedProperty: {
        value: function(property) {
            return property.source === "INHERITED" || property.parsed === null;
        }
    },

    _getPropertySourceFromValue: {
        value: function(property) {
            return property === "none" ? "INHERITED" : "LOCAL";
        }
    }
});
