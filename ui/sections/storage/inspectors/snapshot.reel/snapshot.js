/**
 * @module ui/snapshot.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class Snapshot
 * @extends Component
 */
exports.Snapshot = AbstractInspector.specialize(/** @lends Snapshot# */ {

    pathDisplayMode: {
        value: null
    },

    _context: {
        value: null
    },

    context: {
        get: function() {
            return this._context;
        },
        set: function(context) {
            if (this._context != context) {
                this._context = context;
            }
            this._loadVolume();
            this._loadParentDataset();
        }
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function (object) {
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    if (object.id == void 0) {
                        this._object.replicable = true;
                        this.pathDisplayMode = "select";
                    } else {
                        this.pathDisplayMode = "display";
                    }
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            this.super();

            this._loadVolume();
            this._loadParentDataset();
            this._loadExpirationDate();
        }
    },

    revert: {
        value: function() {
            var self = this;
            this.inspector.revert().then(function() {
                self._loadExpirationDate();
            });
        }
    },

    save: {
        value: function() {
            var created = this.object.properties ? (+this.object.properties.creation.rawvalue * 1000) : Date.now(),
                expires = this._expirationType === 'at' ? this._expirationDate.getTime() :
                    this._expirationType === 'after' ? (Date.now() + this._lifetime * 1000) : 0;

            this.object.lifetime = expires ? Math.round((expires - created) / 1000) : null;

            if (this.object._isNew) {
                return this.inspector.save(this.object._recursive);
            }
            return this.inspector.save();
        }
    },

    delete: {
        value: function() {
            var self = this;
 
            return this.inspector.delete(this.extraDeleteFlags[0].checked);
        }
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
                    if (currentSelection[i].constructor.Type == Model.Volume) {
                        return currentSelection[i];
                    }
                }
            }
        }
    },

    _loadExpirationDate: {
        value: function() {
            var now = new Date(),
                defaultExpirationDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
                expirationDate = null;

            if (!this.object._isNew) {
                if (this._object.lifetime && this._object.properties) {
                    expirationDate = new Date((+this.object.properties.creation.rawvalue + this.object.lifetime) * 1000);    
                }
            } else {
                expirationDate = defaultExpirationDate;
            }

            this._expirationType = expirationDate ? 'at' : 'never';
            this._expirationDate = expirationDate || defaultExpirationDate;
            this._lifetime = Math.ceil((this._expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) * (60 * 60 * 24);
        }
    },

    _loadParentDataset: {
        value: function() {
            var dataset = this._getCurrentDataset();
            if (dataset) {
                this._object.dataset = dataset.id;
                this.pathDisplayMode = "display";
            }
        }
    },

    _getCurrentDataset: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (currentSelection[i].constructor.Type == Model.VolumeDataset) {
                        return currentSelection[i];
                    }
                }
            }
        }
    }

}, {
    EXPIRATION_TYPES: {
        value: [
            {
                value: 'never',
                label: 'Never'
            },
            {
                value: 'at',
                label: 'At'
            },
            {
                value: 'after',
                label: 'After'
            }
        ]
    }
});
