/**
 * @module ui/volume-dataset.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class VolumeDataset
 * @extends Component
 */
exports.VolumeDataset = AbstractInspector.specialize(/** @lends VolumeDataset# */ {

    TYPE_OPTIONS: {
        value: [
            {label: "FILESYSTEM", value: "FILESYSTEM"},
            {label: "ZVOL", value: "VOLUME"}
        ]
    },

    volume: {
        value: null
    },

    datasetLevel: {
        value: null
    },

    _path: {
        value: null
    },

    path: {
        get: function() {
            return this._path;
        },
        set: function(path) {
            if (this._path !== path) {
                this._path = path;
                this._setObjectId();
            }
        }
    },

    _name: {
        value: null
    },

    name: {
        get: function() {
            return this._name;
        },
        set: function(name) {
            if (this._name !== name) {
                this._name = name;
                this._setObjectId();
            }
        }
    },

    _inspectorTemplateDidLoad: {
        value:function() {
            var self = this;
            this.snapshotType = this._sectionService.VOLUME_SNAPSHOT_TYPE;
            return this._sectionService.listVolumeSnapshots().then(function(snapshots) {
                return self.snapshots = snapshots;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            this.volume = this._getCurrentVolume();

            if (this.object._isNew) {
                this.object.type = "FILESYSTEM";
                this.object.volume = this.path = this.volume.id;
                this.name = null;
                this.treeController.open();
            }
            var storageService = this.application.storageService;
            storageService.initializeDatasetProperties(this.object);

            if (isFirstTime) {
                this.addPathChangeListener('object.type', this, '_handleExtraValidation');
                this.addPathChangeListener('object.volsize', this, '_handleExtraValidation');
            }
        }
    },

    _handleExtraValidation: {
        value: function() {
            // FIXME: Is conditional validation possible using validation controller?
            this.inspector.isSaveDisabled = (this.object.type == 'VOLUME' && !this.object.volsize);
        }
    },

    _setObjectId: {
        value: function() {
            if (this._name && this._path && this.object) {
                this.object.id = this.path + '/' + this._name;
            }
        }
    },

    _getCurrentVolume: {
        value: function() {
            if (this.context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this.context.columnIndex - 1; i >= 0; i--) {
                    if (currentSelection[i].constructor.Type == Model.Volume) {
                        return currentSelection[i];
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
            this.application.storageService.convertVolumeDatasetSizeProperties(this.object);
            return this.application.dataService.saveDataObject(this.object);
        }
    }
});
