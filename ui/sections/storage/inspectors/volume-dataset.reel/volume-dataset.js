var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

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

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
                this._object._recursive = false;
            }
        }
    },

    _inspectorTemplateDidLoad: {
        value:function() {
            var self = this;
            this.snapshotType = this._sectionService.VOLUME_SNAPSHOT_TYPE;
            this.vmwareDatasetType = this._sectionService.VMWARE_DATASET_TYPE;
            return Promise.all([
                this._sectionService.listSnapshots(),
                this._sectionService.listVmwareDatasets(),
                this._sectionService.getReplicationOptionsInstance()
            ]).spread(function(snapshots, vmwareDatasets, replicationOptions) {
                self.snapshots = snapshots;
                self.vmwareDatasets = vmwareDatasets;
                self.replicationOptions = replicationOptions;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            this.volume = this.selectionService.getClosestParentWithObjectType('Volume', this.context.columnIndex);

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

    save: {
        value: function() {
            if (this.object.type === "FILESYSTEM") {
                this.object.properties.volblocksize = undefined;
            } else if (this.object.type === "VOLUME") {
                this.object.permissions = undefined;
            }
            this.application.storageService.convertVolumeDatasetSizeProperties(this.object);

            return this.inspector.save.apply(this.inspector, this.object._recursive ? [this.object._recursive] : []);
        }
    }
});
