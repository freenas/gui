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
                    this._args[0].lifetime = Math.round((expirationDate.getTime() - Date.now()) / 1000);
                } else {
                    this._args[0].lifetime = null;
                }
            }
        }
    },

    pathDisplayMode: {
        value: null
    },

    _args: {
        value: null
    },

    args: {
        get: function() {
            return this._args;
        },
        set: function(args) {
            if (this._args != args) {
                this._args = args;
                if (args && args.length == 0) {
                    this.application.dataService.getNewInstanceForType(Model.VolumeSnapshot).then(function(snapshot) {
                        snapshot.replicable = true;
                        args.push(snapshot);
                    });
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            if (this._args[0].lifetime) {
                var lifetime = this._args[0].lifetime;
                this.expirationDate = new Date((+this._args[0].properties.creation.rawvalue + this._args[0].lifetime)*1000);
                this._args[0].lifetime = lifetime;
            } else {
                this.expirationDate = null;
            }
            if (this.filesystemTreeController) {
                this.filesystemTreeController.open(this.filesystemTreeController.root);
            }
            this.application.dataService.fetchData(Model.VolumeDataset).then(function(datasets) {
                self.datasets = datasets;
            });
        }
    }

});
