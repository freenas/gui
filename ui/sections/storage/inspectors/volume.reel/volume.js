var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require("lodash");

exports.Volume = AbstractInspector.specialize({
    rootDataset: {
        value: null
    },

    _setVolumeShares: {
        value: function () {
            var volumeId = this.object.id;
            this.object._shares = _.sortBy(
                _.filter(this.shares, function (share) {
                    var targetPath = share.target_path;
                    return  _.startsWith(targetPath, '/mnt/' + volumeId + '/') ||
                            _.isEqual(targetPath, '/mnt/' + volumeId) ||
                            _.startsWith(targetPath, volumeId + '/') ||
                            _.isEqual(targetPath, volumeId);
                }),
                'name'
            );
        }
    },

    _setVolumeSnapshots: {
        value: function () {
            var volumeId = this.object.id;
            this.object._snapshots = _.sortBy(
                _.filter(this.snapshots, function (snapshot) {
                    return _.isEqual(snapshot.volume, volumeId);
                }),
                'name'
            );
        }
    },

    _setVolumeDatasets: {
        value: function () {
            var volumeId = this.object.id;
            this.object._datasets = _.sortBy(
                _.filter(this.datasets, function (snapshot) {
                    return _.isEqual(snapshot.volume, volumeId);
                }),
                'name'
            );
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super(isFirstTime);
            var self = this;
            this._sectionService.getEncryptedVolumeActionsForVolume(this.object).then(function (encryptedVolumeActions) {
                self.encryptedVolumeActions = encryptedVolumeActions;
            });
            this._setVolumeShares();
            this._setVolumeSnapshots();
            this._setVolumeDatasets();
            this.sharesEventListener = this.eventDispatcherService.addEventListener('sharesChange', this._handleSharesChange.bind(this));
            this.snapshotsEventListener = this.eventDispatcherService.addEventListener('volumeSnapshotsChange', this._handleSnapshotsChange.bind(this));
            this.datasetsEventListener = this.eventDispatcherService.addEventListener('volumeDatasetsChange', this._handleDatasetsChange.bind(this));
        }
    },

    exitDocument: {
        value: function () {
            this.eventDispatcherService.removeEventListener('volumeDatasetsChange', this.datasetsEventListener);
            this.eventDispatcherService.removeEventListener('volumeSnapshotsChange', this.snapshotsEventListener);
            this.eventDispatcherService.removeEventListener('sharesChange', this.sharesEventListener);
        }
    },

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this.shareType = this._sectionService.SHARE_TYPE;
            this.addPathChangeListener("object", this, "_handleObjectChange");
            return Promise.all([
                this._sectionService.listShares().then(function (shares) {
                    return self.shares = shares;
                }),
                this._sectionService.listSnapshots().then(function (snapshots) {
                    return self.snapshots = snapshots;
                }),
                this._sectionService.listDatasets().then(function (datasets) {
                    return self.datasets = datasets;
                })
            ]);
        }
    },

    _handleSharesChange: {
        value: function (shares) {
            var self = this;
            this.shares.clear();
            shares.forEach(function (share) {
                self.shares.push(share.toJS());
            });
            this._setVolumeShares();
        }
    },

    _handleSnapshotsChange: {
        value: function (snapshots) {
            var self = this;
            this.snapshots.clear();
            snapshots.forEach(function (snapshot) {
                self.snapshots.push(snapshot.toJS());
            });
            this._setVolumeSnapshots();
        }
    },

    _handleDatasetsChange: {
        value: function (datasets) {
            var self = this;
            this.datasets.clear();
            datasets.forEach(function (dataset) {
                self.datasets.push(dataset.toJS());
            });
            this._setVolumeDatasets();
        }
    },

    _handleObjectChange: {
        value: function () {
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
