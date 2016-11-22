/**
 * @module ui/inspectors/calendar-task.reel/snapshot-args.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class SnapshotArgs
 * @extends Component
 */
exports.SnapshotArgs = Component.specialize(/** @lends SnapshotArgs# */ {
    _dataset: {
        value: null
    },

    dataset: {
        get: function() {
            return this._dataset;
        },
        set: function(dataset) {
            if (this._dataset !== dataset) {
                this._dataset = dataset;
                this.object[0] = dataset;
            }
        }
    },

    _recursive: {
        value: null
    },

    recursive: {
        get: function() {
            return this._recursive;
        },
        set: function(recursive) {
            if (this._recursive !== recursive) {
                this._recursive = recursive;
                this.object[1] = recursive;
            }
        }
    },

    _lifetime: {
        value: null
    },

    lifetime: {
        get: function() {
            return this._lifetime;
        },
        set: function(lifetime) {
            if (this._lifetime !== lifetime) {
                this._lifetime = lifetime;
                this.object[2] = lifetime;
            }
        }
    },

    _prefix: {
        value: null
    },

    prefix: {
        get: function() {
            return this._prefix;
        },
        set: function(prefix) {
            if (this._prefix !== prefix) {
                this._prefix = prefix;
                this.object[3] = prefix;
            }
        }
    },

    _replicable: {
        value: null
    },

    replicable: {
        get: function() {
            return this._replicable;
        },
        set: function(replicable) {
            if (this._replicable !== replicable) {
                this._replicable = replicable;
                this.object[4] = replicable;
            }
        }
    },

    enterDocument: {
        value: function() {
            if (this.object.length != 5) {
                var defaultValues = [null, false, 2592000, "snap", false]
                for (var i = 0, length = defaultValues.length; i < length; i++) {
                    this.object[i] = defaultValues[i];
                }
                while (this.object.length > 5) {
                    this.object.pop();
                }
                this.object.__type = this.type;
            }
            this.dataset = this.object[0];
            this.recursive = this.object[1];
            this.lifetime = this.object[2];
            this.prefix = this.object[3];
            this.replicable = this.object[4];

            if (this.datasetTreeController) {
                this.datasetTreeController.open();
            }
        }
    }

});
