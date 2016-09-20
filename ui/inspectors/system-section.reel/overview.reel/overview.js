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
            var self = this;
            this.systemInfo = {};
            this.application.dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral) {
                console.log(systemGeneral[0]);
                self.systemInfo.general = systemGeneral[0];
            });
            this.application.storageService.listDatasets().then(function(datasetList) {
                self.systemInfo.totalDatasets = datasetList.length;
            });
            this.application.dataService.fetchData(Model.VolumeSnapshot).then(function (snapshots) {
                self.systemInfo.totalSnapshots = snapshots.length;
            });
            this.application.dataService.fetchData(Model.Share).then(function(shares) {
                self.systemInfo.totalShares = shares.length;
            });
            this.application.systemInfoService.getVersion().then(function(version) {
                self.systemInfo.systemVersion = version;
            });
            this.application.dataService.fetchData(Model.Peer).then(function (peers) {
                self.systemInfo.totalPeers = peers.length;
            });
            this.application.dataService.fetchData(Model.Replication).then(function (replications) {
                self.systemInfo.totalReplications = replications.length;
            })
        }
    }
});
