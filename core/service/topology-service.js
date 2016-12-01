var Montage = require("montage").Montage,
    FakeMontageDataService = require("core/service/fake-montage-data-service").FakeMontageDataService,
    Model = require("core/model/model").Model;

var TopologyService = exports.TopologyService = Montage.specialize({

    RECORD_SIZE: {
        value: 128
    },

    _STORAGE: {
        value: "storage"
    },

    _REDUNDANCY: {
        value: "redundancy"
    },

    _SPEED: {
        value: "speed"
    },

    _dataService: {
        value: null
    },

    _vdevRecommendations: {
        value: null
    },

    init: {
        value: function(vdevRecommendations) {
            this._vdevRecommendations = vdevRecommendations;
            return this;
        }
    },

    getParitySizeOnAllocated: {
        value: function(disksCount, vdevType, allocatedSize) {
            var paritySize = 0;
            switch (vdevType) {
                case 'disk':
                    break;
                case 'mirror':
                    // A mirror's parity amount is the number of disks minus one times the size of the disks.
                    paritySize = (disksCount - 1) * (allocatedSize / disksCount);
                    break;
                case 'raidz1':
                    paritySize = this._getRaidzParityRatioOnAllocated(disksCount, 1) * allocatedSize;
                    break;
                case 'raidz2':
                    paritySize = this._getRaidzParityRatioOnAllocated(disksCount, 2) * allocatedSize;
                    break;
                case 'raidz3':
                    paritySize = this._getRaidzParityRatioOnAllocated(disksCount, 3) * allocatedSize;
                    break;
            }
            return paritySize;
        }
    },

    _getRaidzParityRatioOnAllocated: {
        value: function(disksCount, raidzLevel) {
            var precision = Math.pow(10, raidzLevel+1);
            return (Math.ceil((this.RECORD_SIZE + raidzLevel * Math.floor((this.RECORD_SIZE + disksCount - raidzLevel - 1)/(disksCount - raidzLevel))) * precision) / this.RECORD_SIZE - precision) / precision;
        }
    },

    getParitySizeOnTotal: {
        value: function(disksCount, vdevType, totalSize) {
            var paritySize = 0;
            switch (vdevType) {
                case 'disk':
                    break;
                case 'mirror':
                    // A mirror's parity amount is the number of disks minus one times the size of the disks.
                    paritySize = (disksCount - 1) * (totalSize / disksCount);
                    break;
                case 'raidz1':
                    paritySize = this._getRaidzParityRatioOnTotal(disksCount, 1) * totalSize;
                    break;
                case 'raidz2':
                    paritySize = this._getRaidzParityRatioOnTotal(disksCount, 2) * totalSize;
                    break;
                case 'raidz3':
                    paritySize = this._getRaidzParityRatioOnTotal(disksCount, 3) * totalSize;
                    break;
            }
            return paritySize;
        }
    },

    _getRaidzParityRatioOnTotal: {
        value: function(disksCount, raidzLevel) {
            var precision = Math.pow(10, raidzLevel+1),
                number = Math.ceil((this.RECORD_SIZE + raidzLevel * Math.floor((this.RECORD_SIZE + disksCount - raidzLevel - 1) / (disksCount - raidzLevel)))* precision) / this.RECORD_SIZE;
            return (number - precision)/(number);
        }
    },

    _getVdevRecommendation: {
        value: function(redundancy, speed, storage) {
            var priorities = [
                    {type: this._STORAGE, tieBreaker: 2, weight: Math.round(storage * 10) / 10},
                    {type: this._REDUNDANCY, tieBreaker: 0, weight: Math.round(redundancy * 10) / 10},
                    {type: this._SPEED, tieBreaker: 1, weight: Math.round(speed * 10) / 10}
                ],
                orderedPriorities = priorities.sort(function (a, b) {
                    var delta = b.weight - a.weight;
                    if (delta == 0) {
                        delta = b.tieBreaker - a.tieBreaker;
                    }
                    return delta;
                }),
                firstPriority = orderedPriorities[0],
                secondPriority = orderedPriorities[1].weight > 0 ? orderedPriorities[1] : orderedPriorities[0];

            return {
                recommendation: this._vdevRecommendations[firstPriority.type][secondPriority.type],
                priorities: [firstPriority.type, secondPriority.type]
            };
        }
    },

    _getDisksGroups: {
        value: function (disks) {
            var disksGroups = [],
                groupsUniquer = {},
                i, length, disk, key;

            for (i = 0, length = disks.length; i < length; i++) {
                disk = disks[i];
                key = disk.status.is_ssd + '_' + disk.mediasize + '_' + disk.max_rotation;

                if (!groupsUniquer[key]) {
                    groupsUniquer[key] = [];
                    disksGroups.push(groupsUniquer[key]);
                }

                // Make non ssd weighter than ssd
                disk.isSpinning = 1/(1+disk.status.is_ssd);
                groupsUniquer[key].push(disk);
            }

            return disksGroups.sort(function(a, b) {
                var delta = b.length - a.length,
                    meaningfulSpecifications = ['isSpinning', 'size'],
                    diskA = a[0], diskB = b[0],
                    specification;

                while (delta === 0 && meaningfulSpecifications.length > 0 && diskA) {
                    specification = meaningfulSpecifications.shift();
                    delta = +diskB[specification] - +diskA[specification];
                }

                return delta;
            });
        }
    },

    diskToVdev: {
        value: function(disk) {
            return {
                _isNew: true,
                _objectType: 'ZfsVdev',
                path: disk.path,
                _disk: disk,
                type: 'disk'
            };
        }
    },

    vdevToDisk: {
        value: function(vdev) {
            return vdev._disk;
        }
    },

    populateDiskWithinVDev: {
        value: function (vDev) {
            var self = this;

            return this._dataService.fetchData(Model.Disk).then(function (disks) {
                var children = vDev.children,
                    tmpVDev;

                for (var i = 0, l = children.length; i < l; i++) {
                    tmpVDev = children[i];

                    if (!tmpVDev._disk) {
                        tmpVDev._disk = self._findDiskWithPath(disks, tmpVDev.path);
                    }
                }
            });
        }
    },

    _findDiskWithPath: {
        value: function  (disks, path) {
            var response,
                disk;

            for (var i = 0, length = disks.length; i < length; i++) {
                disk = disks[i];

                if (disk.path === path) {
                    response = disk;
                    break;
                }
            }

            return disk;
        }
    },

    _buildVdevWithDisks: {
        value: function (type, disks) {
            return {
                _isNew: true,
                _objectType: 'ZfsVdev',
                type: type,
                children: disks.map(this.diskToVdev)
            };
        }
    },

    _addDisksToVdev: {
        value: function(disks, vdev) {
            if (!vdev.children) {
                vdev.children = [];
            }

            for (var i = 0, length = disks.length; i < length; i++) {
                vdev.children.push(this.diskToVdev(disks[i]));
            }
        }
    },

    _buildDataVdevsWithDisks: {
        value: function(type, size, dataDisks) {
            var vdevs = [],
                disks = dataDisks.slice(0, size),
                sliceStart = size;


            vdevs.push(this._buildVdevWithDisks(type, disks));
            disks = dataDisks.slice(sliceStart, sliceStart + size);
            sliceStart += size;

            while (disks.length >= size) {
                vdevs.push(this._buildVdevWithDisks(type, disks));
                disks = dataDisks.slice(sliceStart, sliceStart + size);
                sliceStart += size;
            }

            if (disks.length > 0) {
                //fixme: @pierre probably dead code
                this._clearDisks(disks);

                if (vdevs.length == 1) {
                    if (disks.length <= (size / 2)) {
                        this._addDisksToVdev(disks, vdevs[0]);
                    } else {
                        vdevs = this._buildDataVdevsWithDisks(type, Math.floor(dataDisks.length / 2), dataDisks);
                    }
                } else {
                    var i, length, vdev,
                        bonusDiskCountPerVdev = Math.floor(disks.length / vdevs.length);
                    for (i = 0, length = vdevs.length; i < length; i++) {
                        vdev = vdevs[i];
                        this._addDisksToVdev(disks.slice(i*bonusDiskCountPerVdev, i*bonusDiskCountPerVdev + bonusDiskCountPerVdev), vdev);
                    }
                }
            }
            var i, length, vdev;
            for (i = 0, length = vdevs.length; i < length; i++) {
                vdev = vdevs[i];
                if (vdev.children && vdev.children.length == 1) {
                    vdev.type = 'disk';
                }
            }
            return vdevs;
        }
    },

    _clearDisks: {
        value: function (disks) {
            var disk;

            if (disks) {
                for (var i = 0, length = disks.length; i < length; i++) {
                    disk = disks[i].volume = null;
                }
            }
        }
    },

    _areVdevDifferents: {
        value: function(a, b) {
            var aDisks, bDisks,
                j, disksLength,
                result = a.length != b.length;
            if (!result) {
                for (var i = 0, length = a.length; i < length; i++) {
                    if (a[i].children.length != b[i].children.length) {
                        result = true;
                        break;
                    } else {
                        aDisks = a[i].children.map(function(x) { return x._disk.path }).sort();
                        bDisks = b[i].children.map(function(x) { return x._disk.path }).sort();
                        for (j=0, disksLength = aDisks.length; j < disksLength; j++) {
                            if (aDisks[j] != bDisks[j]) {
                                result = true;
                                break;
                            }
                        }
                        if (result) {
                            break;
                        }
                    }
                }
            }
            return result;
        }
    },

    generateTopology: {
        value: function(topology, disks, redundancy, speed, storage) {
            if (disks && disks.length > 0) {
                var vdevRecommendation,
                    newTopology,
                    disksGroups = this._getDisksGroups(disks),
                    dataDisks = disksGroups.shift();

                if (dataDisks.length > 3) {
                    vdevRecommendation = this._getVdevRecommendation(redundancy, speed, storage);
                } else if (dataDisks.length > 2) {
                    vdevRecommendation = {
                        recommendation: {
                            type: 'raidz1',
                            drives: 3
                        },
                        priorities: []
                    };
                } else {
                    vdevRecommendation = {
                        recommendation: {
                            type: 'mirror',
                            drives: 2
                        },
                        priorities: []
                    };
                }

                this._clearDisks(disks);

                //Avoid to create garbage and to dispatch useless changes.
                if (topology.cache.length) {
                    topology.cache = [];
                }

                if (topology.log.length) {
                    topology.log = [];
                }

                if (topology.spare.length) {
                    topology.spare = [];
                }

                newTopology = this._buildDataVdevsWithDisks(vdevRecommendation.recommendation.type, vdevRecommendation.recommendation.drives, dataDisks);
                if (this._areVdevDifferents(newTopology, topology.data)) {
                    topology.data = newTopology;
                }

                return vdevRecommendation.priorities;
            } else {
                return topology;
            }
        }
    }
}, {
    instance: {
        get: function(dataService) {
            if (!this._instance) {
                this._instance = new TopologyService().init(FakeMontageDataService.getInstance());
            }
            return this._instance;
        }
    }
});
