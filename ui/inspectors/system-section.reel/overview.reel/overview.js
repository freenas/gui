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
            this.isLoading = true;
            this.systemInfo = {};
            loadingPromises.push(
                this.application.systemGeneralService.getSystemGeneralData().then(function (systemGeneral) {
                    self.systemInfo.general = systemGeneral;
                }),
                this.application.storageService.listDatasets().then(function (datasetList) {
                    self.systemInfo.totalDatasets = datasetList.length;
                }),
                this.application.storageService.getVolumeSnapshotData().then(function (snapshots) {
                    self.systemInfo.totalSnapshots = snapshots.length;
                }),
                this.application.storageService.getShareData().then(function (shares) {
                    self.systemInfo.totalShares = shares.length;
                }),
                this.application.systemInfoService.getVersion().then(function (version) {
                    self.systemInfo.systemVersion = version;
                }),
                this.application.storageService.getPeerData().then(function (peers) {
                    self.systemInfo.totalPeers = peers.length;
                }),
                this.application.storageService.getReplicationData().then(function (replications) {
                    self.systemInfo.totalReplications = replications.length;
                })
            );
            Promise.all(loadingPromises).then(function() {
                this.isLoading = false;
            })
        }
    }
});
