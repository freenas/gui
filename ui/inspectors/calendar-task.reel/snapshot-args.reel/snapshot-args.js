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
                this.args[0] = dataset;
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
                this.args[1] = recursive;
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
                this.args[2] = lifetime;
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
                this.args[3] = prefix;
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
                this.args[4] = replicable;
            }
        }
    },

    enterDocument: {
        value: function() {
            if (this.args.length != 5 || (this.args.__type && this.args.__type !== this.type)) {
                var defaultValues = [null, false, 2592000, "snap", false]
                for (var i = 0, length = defaultValues.length; i < length; i++) {
                    this.args[i] = defaultValues[i];
                }
                while (this.args.length > 5) {
                    this.args.pop();
                }
                this.args.__type = this.type;
            }
            this.dataset = this.args[0];
            this.recursive = this.args[1];
            this.lifetime = this.args[2];
            this.prefix = this.args[3];
            this.replicable = this.args[4];

            if (this.datasetTreeController) {
                this.datasetTreeController.open();
            }
        }
    }

});
