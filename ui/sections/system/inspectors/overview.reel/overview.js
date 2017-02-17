var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Overview = AbstractInspector.specialize({

    systemInfo: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this.systemInfo = {};
            this.isSystemGeneralLoading = true;
            this._sectionService.getSystemGeneral().then(function (systemGeneral) {
                self.systemInfo.general = systemGeneral;
                self.isSystemGeneralLoading = false;
            });
            this.isSystemTimeLoading = true;
            this._sectionService.getSystemTime().then(function (time) {
                self.systemTime = time;
                self.isSystemTimeLoading = false;
            });
            this.isVmsLoading = true;
            this._sectionService.listVms().then(function (virtualMachines) {
                self.virtualMachines = virtualMachines;
                self.isVmsLoading = false;
            });
            this.isDockerLoading = true;
            this._sectionService.listContainers().then(function (dockerContainers) {
                self.containers = dockerContainers;
                self.isDockerLoading = false;
            });
            this.isVolumeDatasetLoading = true;
            this._sectionService.listVolumeDatasets().then(function (datasetList) {
                self.systemInfo.datasets = datasetList;
                self.isVolumeDatasetLoading = false;
            });
            this.isSnapshotsLoading = true;
            this._sectionService.listVolumeSnapshots().then(function (snapshots) {
                self.systemInfo.snapshots = snapshots;
                self.isSnapshotsLoading = false;
            });
            this.isSharesLoading = true;
            this._sectionService.listShares().then(function (shares) {
                self.systemInfo.shares = shares;
                self.isSharesLoading = false;
            });
            this.isVersionLoading = true;
            this._sectionService.getSystemVersion().then(function (version) {
                self.systemInfo.systemVersion = version;
                self.isVersionLoading = false;
            });
            this.isPeersLoading = true;
            this._sectionService.listPeers().then(function (peers) {
                self.systemInfo.peers = peers;
                self.isPeersLoading = false;
            });
            this.isReplicationsLoading = true;
            this._sectionService.listReplications().then(function (replications) {
                self.systemInfo.replications = replications;
                self.isReplicationsLoading = false;
            });
            this.isVolumesLoading =true;
            this._sectionService.listVolumes().then(function (volumes) {
                self.systemInfo.volumes = volumes;
                self.isVolumesLoading = false;
            });
            this.isDisksLoading = true;
            this._sectionService.listDisks().then(function (disks) {
                self.systemInfo.disks = disks
                self.isDisksLoading = false;
            });
            this.isSystemDatasetLoading = true;
            this._sectionService.getSystemDataset().then(function(systemDataset) {
                self.systemDatasetData = systemDataset.pool;
                self.isSystemDatasetLoading = false;
            });
            this.isNetworkLoading = true;
            this._sectionService.listNetworkInterfaces().then(function (totalNetworkInterfaces) {
                self.systemInfo.totalNetworkInterfaces = totalNetworkInterfaces;
                self.isNetworkLoading = false;
            });
        }
    }
});
