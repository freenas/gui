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
            return Promise.all([
                this._sectionService.listVmwareDatasets()
            ]).spread(function(vmwareDatasets) {
                self.vmwareDatasets = vmwareDatasets;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();

            if (this.object._isNew) {
                this.object.type = "FILESYSTEM";
                this.object.volume = this.path = this.object._volume.id;
                this.name = null;
                this.treeController.open();
            }
            this._sectionService.initializeDatasetProperties(this.object);

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
                delete this.object.permissions.acl;
            } else if (this.object.type === "VOLUME") {
                this.object.permissions = undefined;
            }

            return this.inspector.save.apply(this.inspector, this.object._recursive ? [this.object._recursive] : []);
        }
    }
});
