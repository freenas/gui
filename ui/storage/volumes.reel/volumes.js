var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Volumes
 * @extends Component
 */
exports.Volumes = Component.specialize({
    _volumeService: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this,
                volume,
                i, length;
            if (isFirstTime) {
                this._volumeService = Model.getPrototypeForType(Model.Volume).then(function(Volume) {
                    return Volume.constructor;
                });
                this._listVolumes().then(function(volumes) {
                    self.volumes = volumes;
                    for (i = 0, length = self.volumes.length; i < length; i++) {
                        volume = self.volumes[i];
                        volume.scrub = {
                            name: "Scrub",
                            inspector: "ui/inspectors/scrub.reel"
                        };
                    }
                    return self._listSnapshots();
                }).then(function(volumesSnapshots) {
                    var volume;
                    for (i = 0, length = self.volumes.length; i < length; i++) {
                        volume = self.volumes[i];
                        volume.snapshots = volumesSnapshots[volume.name] || [];
                        volume.snapshots.name = "Snapshots";
                        volume.snapshots.inspector = "ui/controls/viewer.reel";
                    }
                    return self._listShares();
                }).then(function(volumesShares) {
                    var volume;
                    for (i = 0, length = self.volumes.length; i < length; i++) {
                        volume = self.volumes[i];
                        volume.shares = volumesShares[volume.name] || [];
                        volume.shares.name = "Shares";
                        volume.shares.inspector = "ui/controls/viewer.reel";
                    }
                    return self._listDisks();
                }).then(function(disks) {
                    var volume;
                    for (i = 0, length = self.volumes.length; i < length; i++) {
                        volume = self.volumes[i];
                        volume.topology.spare = disks || [];
                    }
                });
            }
        }
    },

    _listVolumes: {
        value: function() {
            return this.application.dataService.fetchData(Model.Volume).then(function(volumes) {
                var displayedVolumes = [],
                    displayedVolume,
                    volume,
                    i;
                for (i = 0; i < volumes.length; i++) {
                    volume = volumes[i];
                    displayedVolume = {
                        name: volume.id,
                        size: volume.properties.size.rawvalue,
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

    _listSnapshots: {
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
                    snapshot.inspector = "ui/inspectors/snapshot.reel";
                    volumesSnapshots[snapshot.volume].push(snapshot);
                }
                return volumesSnapshots;
            });
        }
    },

    _listShares: {
        value: function() {
            var self = this;
            return this.application.dataService.fetchData(Model.Share).then(function(shares) {
                var volumesShares = {},
                    i,
                    length,
                    volumeNamePromises = [];
                for (i = 0, length = shares.length; i < length; i++) {
                    volumeNamePromises.push(self._addShareToVolumeShares(shares[i], volumesShares));
                }
                return Promise.all(volumeNamePromises).then(function() {
                    return volumesShares;
                })
            });

        }
    },

    _listDisks: {
        value: function() {
            var self = this;
            return this._volumeService.then(function(volumeService) {
                return volumeService.getAvailableDisks();
            }).then(function(availableDisksPaths) {
                return self.application.dataService.fetchData(Model.Disk).then(function(disks) {
                    return disks.filter(function(x) { return availableDisksPaths.indexOf(x.path) != -1 });
                });
            });
        }
    },

    _addShareToVolumeShares: {
        value: function(share, volumesShares) {
            return this._getVolumeNameFromShare(share).then(function(volumeName) {
                if (!volumesShares.hasOwnProperty(volumeName)) {
                    volumesShares[volumeName] = [];
                }
                share.inspector = "ui/inspectors/share.reel";
                volumesShares[volumeName].push(share);
            });
        }
    },

    _getVolumeNameFromShare: {
        value: function(share) {
/*
            return this._volumeService.then(function(volumeService) {
                return volumeService.decodePath(share.filesystem_path);
            });
*/
            // FIXME: Replace with real RPC call
            console.warn('Replace with real RPC call');
            return Promise.resolve(share.filesystem_path.split('/')[2]);
        }
    }

});
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
