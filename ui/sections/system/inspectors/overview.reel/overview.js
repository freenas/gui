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
                this.application.systemService.getGeneral().then(function (systemGeneral) {
                    self.systemInfo.general = systemGeneral;
                }),
                this.application.systemService.getTime().then(function (time) {
                    self.systemTime = time
                }),
                this._sectionService.listVms().then(function (virtualMachines) {
                    self.virtualMachines = virtualMachines;
                }),
                this._sectionService.listContainers().then(function (dockerContainers) {
                    self.containers = dockerContainers;
                }),
                this.application.storageService.listDatasets().then(function (datasetList) {
                    self.systemInfo.datasets = datasetList;
                }),
                this.application.storageService.listVolumeSnapshots().then(function (snapshots) {
                    self.systemInfo.snapshots = snapshots;
                }),
                this.application.storageService.getShareData().then(function (shares) {
                    self.systemInfo.shares = shares;
                }),
                this.application.systemService.getVersion().then(function (version) {
                    self.systemInfo.systemVersion = version;
                }),
                this.application.peeringService.listPeers().then(function (peers) {
                    self.systemInfo.peers = peers;
                }),
                this.application.replicationService.listReplications().then(function (replications) {
                    self.systemInfo.replications = replications;
                }),
                this.application.storageService.listVolumes().then(function (volumes) {
                    self.systemInfo.volumes = volumes;
                }),
                this.application.storageService.listDisks().then(function (disks) {
                    self.systemInfo.disks = disks
                }),
                this.application.systemService.getSystemDatasetPool().then(function(systemDatasetPool) {
                    self.systemDatasetData = systemDatasetPool.pool;
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
