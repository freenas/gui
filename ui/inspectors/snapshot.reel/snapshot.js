/**
 * @module ui/snapshot.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Snapshot
 * @extends Component
 */
exports.Snapshot = Component.specialize(/** @lends Snapshot# */ {
    _expirationDate: {
        value: null
    },

    expirationDate: {
        get: function() {
            return this._expirationDate;
        },
        set: function(expirationDate) {
            if (this._expirationDate !== expirationDate) {
                this._expirationDate = expirationDate;
                if (expirationDate) {
                    this.object.lifetime = Math.round((expirationDate.getTime() - Date.now()) / 1000);
                } else {
                    this.object.lifetime = null;
                }
            }
        }
    },

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
            if (this._object != object) {
                this._object = object;
                if (object) {
                    var self = this;
                    if (object.id == void 0) {
                        this._object.replicable = true;
                        this.pathDisplayMode = "select";
                    } else {
                        this.pathDisplayMode = "display";
                    }
                    this._loadVolume();
                    if (this.filesystemTreeController && !object.dataset) {
                        this.filesystemTreeController.open(this.filesystemTreeController.root).then(function() {
                            object.dataset = self.filesystemTreeController.selectedPath;
                        });
                    }
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            if (this._object.lifetime) {
                var lifetime = this.object.lifetime;
                this.expirationDate = new Date((+this.object.properties.creation.rawvalue + this.object.lifetime)*1000);
                this.object.lifetime = lifetime;
            } else {
                this.expirationDate = null;
            }
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
                    if (currentSelection.path[i].constructor.Type == Model.Volume) {
                        return currentSelection.path[i];
                    }
                }
            }
        }
    }

});
