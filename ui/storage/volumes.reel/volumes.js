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

    _dataService: {
        value: null
    },

    _volumesById: {
        value: {}
    },

    _shares: {
        value: null
    },
    shares: {
        get: function() {
            return this._shares;
        },
        set: function(shares) {
            if (this._shares != shares) {
                this._shares = shares;
            }
        }
    },

    _loadDependencies: {
        value: function () {
            var self = this;
            return this._listShares().then(function (shares) {
                self.shares = shares;
                return self._listSnapshots();
            }).then(function (snapshots) {
                self.snapshots = snapshots;
                return self._listDisks();
            }).then(function (disks) {
                self.spare = disks || [];
            });
        }
    },

    _listVolumes: {
        value: function () {
            return this._dataService.fetchData(Model.Volume);
        }
    },

    _initializeServices: {
        value: function () {
            var self = this;
            this._dataService = this.application.dataService;
            return Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                self._volumeService = Volume.constructor;
            }).then(function() {
                return Model.populateObjectPrototypeForType(Model.ZfsTopology);
            }).then(function() {
                return Model.populateObjectPrototypeForType(Model.Scrub);
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            if (isFirstTime) {
                self.addRangeAtPathChangeListener("shares", this, "handleSharesChange");
                self.addRangeAtPathChangeListener("volumes", this, "handleVolumesChange");
                this._initializeServices().then(function() {
                    self.type = Model.Volume;
                    self._listVolumes().then(function(volumes) {
                        self.volumes = volumes;
                        return self._loadDependencies();
                    }).then(function () {
                        var volume,
                            i, length;
                        for (i = 0, length = self.volumes.length; i < length; i++) {
                            volume = self.volumes[i];
                            volume.shares = self.shares;
                            volume.snapshots = self.snapshots;
                            volume.topology.spare = self.spare;
                        }
                    });
                });
            }
        }
    },

    handleSharesChange: {
        value: function(shares) {
            var volumeNamePromise,
                volumeNamesPromises = [],
                share,
                i, length;
            for (i = 0, length = shares.length; i < length; i++) {
                share = shares[i];
                if (!share.volume) {
                    volumeNamePromise = this._getContainingVolume(share);
                } else {
                    volumeNamePromise = Promise.resolve(share.volume);
                }
                volumeNamesPromises.push(volumeNamePromise);
            }
            Promise.all(volumeNamesPromises).then(function(volumeNames) {
                for (i =0, length = shares.length; i < length; i++) {
                    shares[i].volume = volumeNames[i];
                }
            });
        }
    },

    handleVolumesChange: {
        value: function(volumes) {
            var volume, i, length;
            for (i = 0, length = volumes.length; i < length; i++) {
                volume = volumes[i];
                volume.scrubs = this._dataService.getDataObject(Model.Scrub);
                this._volumesById[volume.id] = volume;
            }
            console.log(volumes, this._volumesById);
        }
    },

    _listSnapshots: {
        value: function() {
            return this._dataService.fetchData(Model.VolumeSnapshot);
        }
    },

    _listShares: {
        value: function() {
            return this._dataService.fetchData(Model.Share);
        }
    },

    _listDisks: {
        value: function() {
            var self = this;
            return this._volumeService.getAvailableDisks().then(function(availableDisksPaths) {
                return self._dataService.fetchData(Model.Disk).then(function(disks) {
                    return disks.filter(function(x) { return availableDisksPaths.indexOf(x.path) != -1 });
                });
            });
        }
    },

    _getContainingVolume: {
        value: function(share) {
            var self = this;
            return this._volumeService.decodePath(share.filesystem_path).then(function (decodedPath) {
                return self._volumesById[decodedPath[0]];
            });
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
