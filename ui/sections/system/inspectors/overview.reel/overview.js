/**
 * @module ui/inspectors/system-section.reel/overview.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Overview
 * @extends Component
 */
exports.Overview = Component.specialize(/** @lends Overview# */ {

    systemInfo: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            var self = this,
                loadingPromises = [];
            this._canDrawGate.setField(this.constructor._CAN_DRAW_FIELD, false);
            this.isLoading = true;
            this.systemInfo = {};
            loadingPromises.push(
                this.application.systemService.getGeneral().then(function (systemGeneral) {
                    self.systemInfo.general = systemGeneral;
                }),
                this.application.systemService.getTime().then(function (time) {
                    self.systemTime = time
                }),
                this.application.virtualMachineService.listVirtualMachines().then(function (virtualMachines) {
                    self.virtualMachines = virtualMachines;
                }),
                this.application.dockerSettingsService.getDockerContainers().then(function (dockerContainers) {
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
                this.application.systemInfoService.getVersion().then(function (version) {
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
                this.application.systemDatasetService.getSystemDatasetPool().then(function(systemDatasetPool) {
                    self.systemDatasetData = systemDatasetPool.pool;
                }),
                this.application.networkInterfacesSevice.getNetworkInterfaces().then(function (totalNetworkInterfaces) {
                    self.systemInfo.totalNetworkInterfaces = totalNetworkInterfaces;
                })
            );
            Promise.all(loadingPromises).then(function() {
                this.isLoading = false;
                self._canDrawGate.setField(self.constructor._CAN_DRAW_FIELD, true);
            })
        }
    }
}, {
    _CAN_DRAW_FIELD: {
        value: "infoLoaded"
    }
});
