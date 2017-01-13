import { VolumeRepository } from '../repository/volume-repository';
import { DiskRepository } from '../repository/disk-repository';
import * as immutable from 'immutable';
import * as Promise from 'bluebird';

const CONSTRAINTS_KEYS = {
    STORAGE: 'storage',
    REDUNDANCY: 'redundancy',
    SPEED: 'speed'
};

const RECORD_SIZE = 128;

export class TopologyProfile {
    constructor(
        readonly redundancy: number,
        readonly speed: number,
        readonly storage: number
    ) { }
}

export class TopologyService {

    private static instance: TopologyService;

    private static profiles: immutable.Map<string, TopologyProfile>;

    private static vdevRecommendations: any;

    private volumeRepository: VolumeRepository;

    private diskRepository: DiskRepository;

    private constructor() {
        this.volumeRepository = VolumeRepository.getInstance();
        this.diskRepository = DiskRepository.getInstance();
    }

    public static getInstance() {
        if (!TopologyService.instance) {
            TopologyService.instance = new TopologyService();
            TopologyService.generateProfiles();
        }
        return TopologyService.instance;
    }

    public init() {
        return this.getVdevRecommendations();
    }

    public getVdevRecommendations() {
        if (!TopologyService.vdevRecommendations) {
            return this.volumeRepository.getVdevRecommendations().then((vdevRecommendations) => {
                return (TopologyService.vdevRecommendations = vdevRecommendations);
            });
        }

        return Promise.resolve(TopologyService.vdevRecommendations);
    }

    public generateTopology(disks: Array<Object>, topologyProfile: TopologyProfile) {
        if (disks && disks.length) {
            this.diskRepository.clearReservedDisks();

            return this.volumeRepository.getTopologyInstance().then((topology) => {
                let disksGroups = this.getDisksGroups(disks),
                    dataDisks = disksGroups.shift(),
                    vdevRecommendation;

                if (dataDisks.length > 3) {
                    vdevRecommendation = this.getVdevRecommendation(
                        topologyProfile.redundancy,
                        topologyProfile.speed,
                        topologyProfile.storage
                    );
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

                this.clearDisks(disks);

                topology.data = this.buildDataVdevsWithDisks(
                    vdevRecommendation.recommendation.type,
                    vdevRecommendation.recommendation.drives,
                    dataDisks
                );

                let vdev, j, disksLength;
                for (let i = 0, vdevsLength = topology.data.length; i < vdevsLength; i++) {
                    vdev = topology.data[i];
                    if (Array.isArray(vdev.children)) {
                        for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                            this.diskRepository.markDiskAsReserved(vdev.children[j].path);
                        }
                    } else {
                        this.diskRepository.markDiskAsReserved(vdev.path);
                    }
                }

                return topology;
            });
        }

        return Promise.resolve(null);
    }

    public getProfiles(): immutable.Map<string, TopologyProfile> {
        return TopologyService.profiles;
    }

    public diskToVdev(disk) {
        return {
            _isNew: true,
            _objectType: 'ZfsVdev',
            path: disk.path,
            _disk: disk,
            type: 'disk'
        };
    }

    public vdevToDisk(vdev) {
        return vdev._disk;
    }

    public populateDiskWithinVDev(vDev) {
        return this.diskRepository.listDisks().then((disks) => {
            let children = vDev.children,
                tmpVDev;

            for (let i = 0, l = children.length; i < l; i++) {
                tmpVDev = children[i];

                if (!tmpVDev._disk) {
                    tmpVDev._disk = this.findDiskWithPath(disks, tmpVDev.path);
                }
            }
        });
    }

    public getParitySizeOnTotal(disksCount, vdevType, totalSize) {
        let paritySize = 0;
        switch (vdevType) {
            case 'disk':
                break;
            case 'mirror':
                paritySize = (disksCount - 1) * (totalSize / disksCount);
                break;
            case 'raidz1':
                paritySize = this.getRaidzParityRatioOnTotal(disksCount, 1) * totalSize;
                break;
            case 'raidz2':
                paritySize = this.getRaidzParityRatioOnTotal(disksCount, 2) * totalSize;
                break;
            case 'raidz3':
                paritySize = this.getRaidzParityRatioOnTotal(disksCount, 3) * totalSize;
                break;
        }
        return paritySize;
    }

    public getParitySizeOnAllocated(disksCount, vdevType, allocatedSize) {
        let paritySize = 0;
        switch (vdevType) {
            case 'disk':
                break;
            case 'mirror':
                paritySize = (disksCount - 1) * (allocatedSize / disksCount);
                break;
            case 'raidz1':
                paritySize = this.getRaidzParityRatioOnAllocated(disksCount, 1) * allocatedSize;
                break;
            case 'raidz2':
                paritySize = this.getRaidzParityRatioOnAllocated(disksCount, 2) * allocatedSize;
                break;
            case 'raidz3':
                paritySize = this.getRaidzParityRatioOnAllocated(disksCount, 3) * allocatedSize;
                break;
        }
        return paritySize;
    }

    private getRaidzParityRatioOnTotal(disksCount, raidzLevel) {
        let precision = Math.pow(10, raidzLevel + 1),
            number = Math.ceil((RECORD_SIZE + raidzLevel * Math.floor((RECORD_SIZE + disksCount - raidzLevel - 1) / (disksCount - raidzLevel))) * precision) / RECORD_SIZE;
        return (number - precision) / (number);
    }


    private getRaidzParityRatioOnAllocated(disksCount, raidzLevel) {
        let precision = Math.pow(10, raidzLevel + 1);
        return (Math.ceil((RECORD_SIZE + raidzLevel * Math.floor((RECORD_SIZE + disksCount - raidzLevel - 1) / (disksCount - raidzLevel))) * precision) / RECORD_SIZE - precision) / precision;
    }

    private findDiskWithPath(disks, path) {
        let response,
            disk;

        for (let i = 0, length = disks.length; i < length; i++) {
            disk = disks[i];

            if (disk.path === path) {
                response = disk;
                break;
            }
        }

        return disk;
    }

    private static generateProfiles() {
        if (!this.profiles) {
            this.profiles = immutable.fromJS({
                "media": new TopologyProfile(0, 0, 10),
                "virtualization": new TopologyProfile(0, 10, 0),
                "backup": new TopologyProfile(10, 0, 0),
                "optimal": new TopologyProfile(3, 3, 3)
            });
        }
    };

    private getDiksGroups(disks) {
        let disksGroups = [],
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
            disk.isSpinning = 1 / (1 + disk.status.is_ssd);
            groupsUniquer[key].push(disk);
        }

        return disksGroups.sort((a, b) => {
            let delta = b.length - a.length,
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

    private buildDataVdevsWithDisks(type, size, dataDisks) {
        let vdevs = [],
            disks = dataDisks.slice(0, size),
            sliceStart = size,
            i, length, vdev;

        do {
            vdevs.push(this.buildVdevWithDisks(type, disks));
            disks = dataDisks.slice(sliceStart, sliceStart + size);
            sliceStart += size;
        } while (disks.length >= size)

        if (disks.length) {
            //fixme: @pierre probably dead code
            this.clearDisks(disks);

            if (vdevs.length === 1) {
                if (disks.length <= (size / 2)) {
                    this.addDisksToVdev(disks, vdevs[0]);
                } else {
                    vdevs = this.buildDataVdevsWithDisks(
                        type,
                        Math.floor(dataDisks.length / 2),
                        dataDisks
                    );
                }
            } else {
                let bonusDiskCountPerVdev = Math.floor(disks.length / vdevs.length);

                for (i = 0, length = vdevs.length; i < length; i++) {
                    vdev = vdevs[i];
                    this.addDisksToVdev(disks.slice(
                        i * bonusDiskCountPerVdev,
                        i * bonusDiskCountPerVdev + bonusDiskCountPerVdev
                    ), vdev);
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
    }

    private buildVdevWithDisks(type, disks) {
        return {
            _isNew: true,
            _objectType: 'ZfsVdev',
            type: type,
            children: disks.map(this.diskToVdev)
        };
    }

    private addDisksToVdev(disks, vdev) {
        if (!vdev.children) {
            vdev.children = [];
        }

        for (let i = 0, length = disks.length; i < length; i++) {
            vdev.children.push(this.diskToVdev(disks[i]));
        }
    }

    private clearDisks(disks: Array<any>) {
        if (disks) {
            let disk;

            for (let i = 0, length = disks.length; i < length; i++) {
                disk = disks[i].volume = null;
            }
        }
    }

    private areVdevDifferents(a, b) {
        let aDisks, bDisks,
            j, disksLength,
            result = a.length != b.length;

        if (!result) {
            for (let i = 0, length = a.length; i < length; i++) {
                if (a[i].children.length != b[i].children.length) {
                    result = true;
                    break;
                } else {
                    aDisks = a[i].children.map(function (x) { return x._disk.path }).sort();
                    bDisks = b[i].children.map(function (x) { return x._disk.path }).sort();
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
    }

    public getVdevRecommendation(redundancy, speed, storage) {
        let priorities = [
            { type: CONSTRAINTS_KEYS.STORAGE, tieBreaker: 2, weight: Math.round(storage * 10) / 10 },
            { type: CONSTRAINTS_KEYS.REDUNDANCY, tieBreaker: 0, weight: Math.round(redundancy * 10) / 10 },
            { type: CONSTRAINTS_KEYS.SPEED, tieBreaker: 1, weight: Math.round(speed * 10) / 10 }
        ],
            orderedPriorities = priorities.sort((a, b) => {
                let delta = b.weight - a.weight;
                if (delta == 0) {
                    delta = b.tieBreaker - a.tieBreaker;
                }
                return delta;
            }),
            firstPriority = orderedPriorities[0],
            secondPriority = orderedPriorities[1].weight > 0 ? orderedPriorities[1] : orderedPriorities[0];

        return {
            recommendation: TopologyService.vdevRecommendations[firstPriority.type][secondPriority.type],
            priorities: [firstPriority.type, secondPriority.type]
        };
    }

    private getDisksGroups(disks) {
        let disksGroups = [],
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
            disk.isSpinning = 1 / (1 + disk.status.is_ssd);
            groupsUniquer[key].push(disk);
        }

        return disksGroups.sort((a, b) => {
            let delta = b.length - a.length,
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

}
