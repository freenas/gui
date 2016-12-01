var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = AbstractInspector.specialize({
    rootDataset: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super(isFirstTime);
            var self = this;
           this._sectionService.getEncryptedVolumeActionsForVolume(this.object).then(function (encryptedVolumeActions) {
               self.encryptedVolumeActions = encryptedVolumeActions;
           });
            this.eventDispatcherService.addEventListener('sharesChange', this._handleSharesChange.bind(this));
            this.eventDispatcherService.addEventListener('volumeSnapshotsChange', this._handleSnapshotsChange.bind(this));
            this.eventDispatcherService.addEventListener('volumeDatasetsChange', this._handleDatasetsChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this.eventDispatcherService.removeEventListener('volumeDatasetsChange', this._handleDatasetsChange.bind(this));
            this.eventDispatcherService.removeEventListener('volumeSnapshotsChange', this._handleSnapshotsChange.bind(this));
            this.eventDispatcherService.removeEventListener('sharesChange', this._handleSharesChange.bind(this));
        }
    },

    _inspectorTemplateDidLoad: {
        value:function() {
            var self = this;
            this.shareType = this._sectionService.SHARE_TYPE;
            this.datasetType = this._sectionService.VOLUME_DATASET_TYPE;
            this.snapshotType = this._sectionService.VOLUME_SNAPSHOT_TYPE;
            this.topologyType = this._sectionService.TOPOLOGY_TYPE;
            this.encryptedVolumeActionsType = this._sectionService.ENCRYPTED_VOLUME_ACTIONS_TYPE;
            this.addPathChangeListener("object", this, "_handleObjectChange");
            return Promise.all([
                this._sectionService.listShares().then(function(shares) {
                    return self.shares = shares;
                }),
                this._sectionService.listSnapshots().then(function(snapshots) {
                    return self.snapshots = snapshots;
                }),
                this._sectionService.listDatasets().then(function(datasets) {
                    return self.datasets = datasets;
                })
            ]);
        }
    },

    _handleSharesChange: {
        value: function(shares) {
            var self = this;
            this.shares.clear();
            shares.forEach(function(share) {
                self.shares.push(share.toJS());
            })
        }
    },

    _handleSnapshotsChange: {
        value: function(snapshots) {
            var self = this;
            this.snapshots.clear();
            snapshots.forEach(function(snapshot) {
                self.snapshots.push(snapshot.toJS());
            })
        }
    },

    _handleDatasetsChange: {
        value: function(datasets) {
            var self = this;
            this.datasets.clear();
            datasets.forEach(function(dataset) {
                self.datasets.push(dataset.toJS());
            })
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
