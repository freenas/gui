var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Overview = AbstractInspector.specialize({

    systemInfo: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this.isLoading = true;
            this.systemInfo = {};
            return Promise.all([
                this._sectionService.getSystemGeneral().then(function (systemGeneral) {
                    self.systemInfo.general = systemGeneral;
                }),
                this._sectionService.getSystemTime().then(function (time) {
                    self.systemTime = time
                }),
                this._sectionService.listVms().then(function (virtualMachines) {
                    self.virtualMachines = virtualMachines;
                }),
                this._sectionService.listContainers().then(function (dockerContainers) {
                    self.containers = dockerContainers;
                }),
                this._sectionService.listVolumeDatasets().then(function (datasetList) {
                    self.systemInfo.datasets = datasetList;
                }),
                this._sectionService.listVolumeSnapshots().then(function (snapshots) {
                    self.systemInfo.snapshots = snapshots;
                }),
                this._sectionService.listShares().then(function (shares) {
                    self.systemInfo.shares = shares;
                }),
                this._sectionService.getSystemVersion().then(function (version) {
                    self.systemInfo.systemVersion = version;
                }),
                this._sectionService.listPeers().then(function (peers) {
                    self.systemInfo.peers = peers;
                }),
                this._sectionService.listReplications().then(function (replications) {
                    self.systemInfo.replications = replications;
                }),
                this._sectionService.listVolumes().then(function (volumes) {
                    self.systemInfo.volumes = volumes;
                }),
                this._sectionService.listDisks().then(function (disks) {
                    self.systemInfo.disks = disks
                }),
                this._sectionService.getSystemDataset().then(function(systemDataset) {
                    self.systemDatasetData = systemDataset.pool;
                }),
                this._sectionService.listNetworkInterfaces().then(function (totalNetworkInterfaces) {
                    self.systemInfo.totalNetworkInterfaces = totalNetworkInterfaces;
                })
            ]).then(function() {
                self.isLoading = false;
            })
        }
    }
});
