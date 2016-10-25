var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = AbstractInspector.specialize({
    rootDataset: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value:function() {
            var self = this;
            this.shareType = this._sectionService.SHARE_TYPE;
            this.datasetType = this._sectionService.VOLUME_DATASET_TYPE;
            this.snapshotType = this._sectionService.VOLUME_SNAPSHOT_TYPE;
            this.addPathChangeListener("object", this, "_handleObjectChange");
            return Promise.all([
                this._sectionService.listShares().then(function(shares) {
                    return self.shares = shares;
                }),
                this._sectionService.listVolumeSnapshots().then(function(snapshots) {
                    return self.snapshots = snapshots;
                }),
                this._sectionService.listVolumeDatasets().then(function(datasets) {
                    return self.datasets = datasets;
                })
            ]);
        }
    },

    _handleObjectChange: {
        value: function() {
            if (this.object) {
                var self = this;
                this._sectionService.getRootDatasetForVolume(this.object).then(function(rootDataset) {
                    self.object._rootDataset = rootDataset;
                });
            }
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
