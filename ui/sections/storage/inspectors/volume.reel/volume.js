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
                this._sectionService.setRootDatasetForVolume(this.object);
            }
        }
    },

    handleExportAction: {
        value: function () {
            this._sectionService.exportVolume(this.object);
        }
    },

    handleScrubAction: {
        value: function () {
            this._sectionService.scrubVolume(this.object);
        }
    }
});
