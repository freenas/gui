var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Volumes
 * @extends Component
 */
exports.Volumes = Component.specialize({
    _getVolumeNameFromShare: {
        value: function(share) {
            // FIXME: Replace with real RPC call
            console.warn('Replace with real RPC call');
            return share.filesystem_path.split('/')[2];
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this.listVolumes().then(function(volumes) {
                    self.cascadingList.root = volumes;
                    var volume;
                    for (var i = 0, length = self.cascadingList.root.length; i < length; i++) {
                        volume = self.cascadingList.root[i];
                        volume.scrub = {
                            name: "Scrub",
                            inspector: "ui/inspectors/scrub.reel"
                        };
                    }
                    return self.listSnapshots();
                }).then(function(volumesSnapshots) {
                    var volume;
                    for (var i = 0, length = self.cascadingList.root.length; i < length; i++) {
                        volume = self.cascadingList.root[i];
                        volume.snapshots = volumesSnapshots[volume.name] || [];
                        volume.snapshots.name = "Snapshots";
                        volume.snapshots.inspector = "ui/controls/viewer.reel";
                    }
                    return self.listShares();
                }).then(function(volumesShares) {
                    var volume;
                    for (var i = 0, length = self.cascadingList.root.length; i < length; i++) {
                        volume = self.cascadingList.root[i];
                        volume.shares = volumesShares[volume.name] || [];
                        volume.shares.name = "Shares";
                        volume.shares.inspector = "ui/controls/viewer.reel";
                    }
                }).then(function() {
                    console.log(self.cascadingList.root);
                });
            }
        }
    },

    listVolumes: {
        value: function() {
            var self = this;
            return this.application.dataService.fetchData(Model.Volume).then(function(volumes) {
/*
                var _data_ = [
                    {
                        name: "Volume 1",
                        size: "2 TB",
                        inspector: "ui/inspectors/volume.reel",
                        shares: [
                            {
                                name: "Share 1",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 2",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 3",
                                inspector: "ui/inspectors/share.reel"
                            }
                        ],
                        snapshots: [
                            {
                                name: "Snapshot 1",
                                inspector: "ui/inspectors/snapshot.reel"
                            },
                            {
                                name: "Snapshot 2",
                                inspector: "ui/inspectors/snapshot.reel"
                            }
                        ],
                        scrub: {
                            name: "Scrub",
                            inspector: "ui/inspectors/scrub.reel"
                        },
                        topology: {
                            name: "Topology",
                            inspector: "ui/inspectors/topology.reel"
                        }
                    },
                    {
                        name: "Volume 2 with a very long name",
                        size: "500 GB",
                        inspector: "ui/inspectors/volume.reel",
                        shares: [
                            {
                                name: "Share 1",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 2",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 3",
                                inspector: "ui/inspectors/share.reel"
                            }
                        ],
                        snapshots: [
                            {
                                name: "Snapshot 1",
                                inspector: "ui/inspectors/snapshot.reel"
                            },
                            {
                                name: "Snapshot 2",
                                inspector: "ui/inspectors/snapshot.reel"
                            }
                        ],
                        scrub: {
                            name: "Scrub",
                            inspector: "ui/inspectors/scrub.reel"
                        },
                        topology: {
                            name: "Topology",
                            inspector: "ui/inspectors/topology.reel"
                        }
                    },
                    {
                        name: "Volume 3",
                        size: "1.3 TB",
                        inspector: "ui/inspectors/volume.reel",
                        shares: [
                            {
                                name: "Share 1",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 2",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 3",
                                inspector: "ui/inspectors/share.reel"
                            }
                        ],
                        snapshots: [
                            {
                                name: "Snapshot 1",
                                inspector: "ui/inspectors/snapshot.reel"
                            },
                            {
                                name: "Snapshot 2",
                                inspector: "ui/inspectors/snapshot.reel"
                            }
                        ],
                        scrub: {
                            name: "Scrub",
                            inspector: "ui/inspectors/scrub.reel"
                        },
                        topology: {
                            name: "Topology",
                            inspector: "ui/inspectors/topology.reel"
                        }
                    },
                    {
                        name: "Volume 4",
                        size: "200 MB",
                        inspector: "ui/inspectors/volume.reel",
                        shares: [
                            {
                                name: "Share 1",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 2",
                                inspector: "ui/inspectors/share.reel"
                            },
                            {
                                name: "Share 3",
                                inspector: "ui/inspectors/share.reel"
                            }
                        ],
                        snapshots: [
                            {
                                name: "Snapshot 1",
                                inspector: "ui/inspectors/snapshot.reel"
                            },
                            {
                                name: "Snapshot 2",
                                inspector: "ui/inspectors/snapshot.reel"
                            }
                        ],
                        scrub: {
                            name: "Scrub",
                            inspector: "ui/inspectors/scrub.reel"
                        },
                        topology: {
                            name: "Topology",
                            inspector: "ui/inspectors/topology.reel"
                        }
                    }
                ];
*/
                var displayedVolumes = [],
                    displayedVolume,
                    volume,
                    i;
                for (i = 0; i < volumes.length; i++) {
                    volume = volumes[i];
                    self._decodePath = volume.decode_path;
                    displayedVolume = {
                        name: volume.id,
                        size: volume.topology.data[0].stats.size,
                        inspector: "ui/inspectors/volume.reel",
                        topology: volume.topology
                    };
                    displayedVolume.topology.name = "Topology";
                    displayedVolume.topology.inspector = "ui/inspectors/topology.reel";
                    displayedVolumes.push(displayedVolume);
                }
                displayedVolumes.name = "Volumes";
                displayedVolumes.inspector = "ui/controls/viewer.reel";
                return displayedVolumes
            });
        }
    },

    listSnapshots: {
        value: function() {
            return this.application.dataService.fetchData(Model.VolumeSnapshot).then(function(snapshots) {
                var volumesSnapshots = {},
                    snapshot,
                    i,
                    length;
                for (i = 0, length = snapshots.length; i < length; i++) {
                    snapshot = snapshots[i];
                    if (!volumesSnapshots.hasOwnProperty(snapshot.volume)) {
                        volumesSnapshots[snapshot.volume] = [];
                    }
                    volumesSnapshots[snapshot.volume].push(snapshot);
                }
                return volumesSnapshots;
            });
        }
    },

    listShares: {
        value: function() {
            var self = this;
            return this.application.dataService.fetchData(Model.Share).then(function(shares) {
                var volumesShares = {},
                    share,
                    i,
                    length;
                for (i = 0, length = shares.length; i < length; i++) {
                    share = shares[i];
                    var volumeName = self._getVolumeNameFromShare(share);
                    if (!volumesShares.hasOwnProperty(volumeName)) {
                        volumesShares[volumeName] = [];
                    }
                    volumesShares[volumeName].push(share);
                }
                return volumesShares;
            });

        }
    }

});
