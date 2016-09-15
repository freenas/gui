var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = AbstractInspector.specialize({
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

                this._calculateParity();
            }
        }
    },

    _shares: {
        value: null
    },

    shares: {
        get: function() {
            return this._shares;
        },
        set: function(shares) {
            if (this._shares != shares) {
                this._shares = shares;
                this._shares._meta_data = this.allShares._meta_data;
            }
        }
    },

    _datasets: {
        value: null
    },

    datasets: {
        get: function() {
            return this._datasets;
        },
        set: function(datasets) {
            if (this._datasets != datasets) {
                this._datasets = datasets;
                this._datasets._meta_data = this.allDatasets._meta_data;
                this.rootDataset = this._getRootDataset(this.object);
            }
        }
    },

    _snapshots: {
        value: null
    },

    snapshots: {
        get: function() {
            return this._snapshots;
        },
        set: function(snapshots) {
            if (this._snapshots != snapshots) {
                this._snapshots = snapshots;
                this._snapshots._meta_data = this.allSnapshots._meta_data;
            }
        }
    },

    rootDataset: {
        value: null
    },

    _calculateParity: {
        value: function() {
            if (this._object && this._object.topology) {
                var vdevs = this._object.topology.data,
                    vdev, i, length,
                    paritySize = 0;
                for (i = 0, length = vdevs.length; i < length; i++) {
                    vdev = vdevs[i];
                    if (vdev.children) {
                        paritySize += this.application.topologyService.getParitySizeOnAllocated(vdev.children.length, vdev.type, vdev.stats.allocated);
                    }
                }
                this.paritySize = paritySize;
            }
        }
    },

    exitDocument: {
        value: function() {
            this.superExitDocument();
            this.isConfirmationVisible = false;
        }
    },

    _getRootDataset: {
        value: function (volume) {
            var datasets = this.datasets;
            for (var i=0, length=datasets.length; i<length; i++) {
                if (datasets[i].id === volume.id) {
                    return datasets[i];
                }
            }
        }
    },

    handleExportAction: {
        value: function () {
            this.object.services.export(this.object.id);
        }
    },

    handleScrubAction: {
        value: function () {
            this.object.services.scrub(this.object.id);
        }
    }
});
