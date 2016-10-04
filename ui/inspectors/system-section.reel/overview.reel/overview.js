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
                this.application.systemGeneralService.getSystemGeneral().then(function (systemGeneral) {
                    self.systemInfo.general = systemGeneral;
                }),
                this.application.systemTimeService.getSystemTime().then(function (time) {
                    self.systemTime = time
                }),
                this.application.virtualMachineService.listVirtualMachines().then(function (virtualMachines) {
                    self.virtualMachines = virtualMachines;
                }),
                this.application.dockerSettingsService.getDockerContainers().then(function (dockerContainers) {
                    self.totalContainers = dockerContainers;
                }),
                this.application.storageService.listDatasets().then(function (datasetList) {
                    self.systemInfo.totalDatasets = datasetList.length;
                }),
                this.application.storageService.listVolumeSnapshots().then(function (snapshots) {
                    self.systemInfo.totalSnapshots = snapshots.length;
                }),
                this.application.storageService.getShareData().then(function (shares) {
                    self.systemInfo.totalShares = shares.length;
                }),
                this.application.systemInfoService.getVersion().then(function (version) {
                    self.systemInfo.systemVersion = version;
                }),
                this.application.peeringService.listPeers().then(function (peers) {
                    self.systemInfo.totalPeers = peers.length;
                }),
                this.application.replicationService.listReplications().then(function (replications) {
                    self.systemInfo.totalReplications = replications.length;
                }),
                this.application.storageService.listVolumes().then(function (volumes) {
                    self.systemInfo.totalVolumes = volumes.length;
                }),
                this.application.storageService.listDisks().then(function (disks) {
                    self.systemInfo.totalDisks = disks
                }),
                this.application.systemAdvancedService.getSerialConsoleData().then(function (systemAdvanced) {
                    self.debugkernel = systemAdvanced.debugkernel
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
