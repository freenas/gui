var Component = require("montage/ui/component").Component;

/**
 * @class Volumes
 * @extends Component
 */
exports.Volumes = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                var data, i, self = this;

                data = [
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
                for (i = 0; i < data.length; i++) {
                    data[i].shares.name = "Shares";
                    data[i].shares.inspector = "ui/controls/viewer.reel";
                    data[i].snapshots.name = "Snapshots";
                    data[i].snapshots.inspector = "ui/controls/viewer.reel";
                }
                data.name = "Volumes";
                data.inspector = "ui/controls/viewer.reel";
                this.cascadingList.root = data;
            }
        }
    }

});
