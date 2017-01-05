"use strict";
var volume_repository_1 = require("../repository/volume-repository");
var CONSTRAINTS_KEYS = {
    STORAGE: "storage",
    REDUNDANCY: "redundancy",
    SPEED: "speed"
};
var TopologyProfile = (function () {
    function TopologyProfile(name, redundancy, speed, storage) {
        this.name = name;
        this.redundancy = redundancy;
        this.speed = speed;
        this.storage = storage;
    }
    return TopologyProfile;
}());
exports.TopologyProfile = TopologyProfile;
var TopologyService = (function () {
    function TopologyService() {
    }
    TopologyService.getInstance = function () {
        if (!TopologyService.instance) {
            TopologyService.instance = new TopologyService();
            this.generateProfiles();
        }
        return TopologyService.instance;
    };
    TopologyService.prototype.init = function () {
        this.volumeRepository = volume_repository_1.VolumeRepository.getInstance();
        return this;
    };
    TopologyService.prototype.initWithVdevRecommendations = function (vdevRecommendations) {
        TopologyService.vdevRecommendations = vdevRecommendations;
        return this.init();
    };
    TopologyService.prototype.generateTopology = function (disks, topologyProfile) {
        var _this = this;
        if (disks && disks.length) {
            return this.volumeRepository.getTopologyInstance().then(function (topology) {
                var disksGroups = _this.getDisksGroups(disks), dataDisks = disksGroups.shift(), vdevRecommendation;
                if (dataDisks.length > 3) {
                    vdevRecommendation = _this.getVdevRecommendation(topologyProfile.redundancy, topologyProfile.speed, topologyProfile.storage);
                }
                else if (dataDisks.length > 2) {
                    vdevRecommendation = {
                        recommendation: {
                            type: 'raidz1',
                            drives: 3
                        },
                        priorities: []
                    };
                }
                else {
                    vdevRecommendation = {
                        recommendation: {
                            type: 'mirror',
                            drives: 2
                        },
                        priorities: []
                    };
                }
                _this.clearDisks(disks);
                topology.data = _this.buildDataVdevsWithDisks(vdevRecommendation.recommendation.type, vdevRecommendation.recommendation.drives, dataDisks);
                return topology;
            });
        }
        return Promise.reject("Can't generate topology without any disks");
    };
    TopologyService.prototype.getProfiles = function () {
        return TopologyService.profiles;
    };
    TopologyService.prototype.diskToVdev = function (disk) {
        return {
            _isNew: true,
            _objectType: 'ZfsVdev',
            path: disk.path,
            _disk: disk,
            type: 'disk'
        };
    };
    TopologyService.generateProfiles = function () {
        if (!this.profiles) {
            this.profiles = [
                new TopologyProfile("media", 0, 0, 10),
                new TopologyProfile("virtualization", 0, 10, 0),
                new TopologyProfile("backup", 10, 0, 0),
                new TopologyProfile("optimal", 3, 3, 3)
            ];
        }
    };
    ;
    TopologyService.prototype.buildDataVdevsWithDisks = function (type, size, dataDisks) {
        var vdevs = [], disks = dataDisks.slice(0, size), sliceStart = size, i, length, vdev;
        do {
            vdevs.push(this.buildVdevWithDisks(type, disks));
            disks = dataDisks.slice(sliceStart, sliceStart + size);
            sliceStart += size;
        } while (disks.length >= size);
        if (disks.length) {
            //fixme: @pierre probably dead code
            this.clearDisks(disks);
            if (vdevs.length === 1) {
                if (disks.length <= (size / 2)) {
                    this.addDisksToVdev(disks, vdevs[0]);
                }
                else {
                    vdevs = this.buildDataVdevsWithDisks(type, Math.floor(dataDisks.length / 2), dataDisks);
                }
            }
            else {
                var bonusDiskCountPerVdev = Math.floor(disks.length / vdevs.length);
                for (i = 0, length = vdevs.length; i < length; i++) {
                    vdev = vdevs[i];
                    this.addDisksToVdev(disks.slice(i * bonusDiskCountPerVdev, i * bonusDiskCountPerVdev + bonusDiskCountPerVdev), vdev);
                }
            }
        }
        for (i = 0, length = vdevs.length; i < length; i++) {
            vdev = vdevs[i];
            if (vdev.children && vdev.children.length == 1) {
                vdev.type = 'disk';
            }
        }
        return vdevs;
    };
    TopologyService.prototype.buildVdevWithDisks = function (type, disks) {
        return {
            _isNew: true,
            _objectType: 'ZfsVdev',
            type: type,
            children: disks.map(this.diskToVdev)
        };
    };
    TopologyService.prototype.addDisksToVdev = function (disks, vdev) {
        if (!vdev.children) {
            vdev.children = [];
        }
        for (var i = 0, length_1 = disks.length; i < length_1; i++) {
            vdev.children.push(this.diskToVdev(disks[i]));
        }
    };
    TopologyService.prototype.clearDisks = function (disks) {
        if (disks) {
            var disk = void 0;
            for (var i = 0, length_2 = disks.length; i < length_2; i++) {
                disk = disks[i].volume = null;
            }
        }
    };
    TopologyService.prototype.areVdevDifferents = function (a, b) {
        var aDisks, bDisks, j, disksLength, result = a.length != b.length;
        if (!result) {
            for (var i = 0, length_3 = a.length; i < length_3; i++) {
                if (a[i].children.length != b[i].children.length) {
                    result = true;
                    break;
                }
                else {
                    aDisks = a[i].children.map(function (x) { return x._disk.path; }).sort();
                    bDisks = b[i].children.map(function (x) { return x._disk.path; }).sort();
                    for (j = 0, disksLength = aDisks.length; j < disksLength; j++) {
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
    };
    TopologyService.prototype.getVdevRecommendation = function (redundancy, speed, storage) {
        var priorities = [
            { type: CONSTRAINTS_KEYS.STORAGE, tieBreaker: 2, weight: Math.round(storage * 10) / 10 },
            { type: CONSTRAINTS_KEYS.REDUNDANCY, tieBreaker: 0, weight: Math.round(redundancy * 10) / 10 },
            { type: CONSTRAINTS_KEYS.SPEED, tieBreaker: 1, weight: Math.round(speed * 10) / 10 }
        ], orderedPriorities = priorities.sort(function (a, b) {
            var delta = b.weight - a.weight;
            if (delta == 0) {
                delta = b.tieBreaker - a.tieBreaker;
            }
            return delta;
        }), firstPriority = orderedPriorities[0], secondPriority = orderedPriorities[1].weight > 0 ? orderedPriorities[1] : orderedPriorities[0];
        return {
            recommendation: TopologyService.vdevRecommendations[firstPriority.type][secondPriority.type],
            priorities: [firstPriority.type, secondPriority.type]
        };
    };
    TopologyService.prototype.getDisksGroups = function (disks) {
        var disksGroups = [], groupsUniquer = {}, i, length, disk, key;
        for (i = 0, length = disks.length; i < length; i++) {
            disk = disks[i];
            key = disk.status.is_ssd + '_' + disk.mediasize + '_' + disk.max_rotation;
            if (!groupsUniquer[key]) {
                groupsUniquer[key] = [];
                disksGroups.push(groupsUniquer[key]);
            }
            // Make non ssd weighter than ssd
            disk.isSpinning = 1 / (1 + disk.status.is_ssd);
            groupsUniquer[key].push(disk);
        }
        return disksGroups.sort(function (a, b) {
            var delta = b.length - a.length, meaningfulSpecifications = ['isSpinning', 'size'], diskA = a[0], diskB = b[0], specification;
            while (delta === 0 && meaningfulSpecifications.length > 0 && diskA) {
                specification = meaningfulSpecifications.shift();
                delta = +diskB[specification] - +diskA[specification];
            }
            return delta;
        });
    };
    return TopologyService;
}());
exports.TopologyService = TopologyService;
