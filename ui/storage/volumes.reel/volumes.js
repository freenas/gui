var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Volumes
 * @extends Component
 */
exports.Volumes = Component.specialize({

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
                });
            }
        }
    },

    listVolumes: {
        value: function() {
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
                    displayedVolume = {
                        name: volume.id,
                        size: volume.topology.data[0].stats.size,
                        inspector: "ui/inspectors/volume.reel",
                        shares: [],
                        topology: volume.topology
                    };
                    displayedVolume.shares.name = "Shares";
                    displayedVolume.shares.inspector = "ui/controls/viewer.reel";
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
    }

});
