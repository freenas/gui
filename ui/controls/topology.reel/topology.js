/**
 * @module ui/topology.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;


var CLASS_NAMES_FOR_MODES = {
        READ: "read-mode",
        CREATE: "create-mode",
        UPDATE: "update-mode"
    };


/**
 * @class Topology
 * @extends Component
 */
var Topology = exports.Topology = Component.specialize({

    _topologyService: {
        value: null
    },

    _mode: {
        value: null
    },


    mode: {
        set: function (mode) {
            if (Topology.MODES[mode] && this._mode !== mode) {
                this._swapClassNameAccordingToCurrentMode(this._mode, mode);
                this._mode = mode;
            }
        },
        get: function () {
            if (!this._mode) {
                this._swapClassNameAccordingToCurrentMode(this._mode, Topology.MODES.READ);
                this._mode = Topology.MODES.READ;
            }

            return this._mode;
        }
    },

    templateDidLoad: {
        value: function () {
            //Optimisation, avoid using bindings for values that won't change.
            var constructor = this.constructor,
                vDevTypes = constructor.VDEV_TYPES,
                identifiers = constructor.IDENTIFIERS;

            this.dataTopologyItemComponent.gridIdentifier = identifiers.DATA;
            this.dataTopologyItemComponent.maxVdevType = vDevTypes.RAIDZ3;
            this.dataTopologyItemComponent.maxDefaultVdevType = vDevTypes.RAIDZ1;

            this.cacheTopologyItemComponent.gridIdentifier = identifiers.CACHE;
            this.cacheTopologyItemComponent.maxVdevType = vDevTypes.DISK;

            this.logTopologyItemComponent.gridIdentifier = identifiers.LOG;
            this.logTopologyItemComponent.maxVdevType = vDevTypes.MIRROR;

            this.spareTopologyItemComponent.gridIdentifier = identifiers.SPARE;
            this.spareTopologyItemComponent.maxVdevType = vDevTypes.DISK;

            this._sectionService = this.application.sectionService;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);

            if (isFirstTime) {
                this._topologyService = this.application.topologyService;
            }

            this.addEventListener("vDevCreated", this, false);
            this.addEventListener("diskAddedToVDev", this, false);
        }
    },


    exitDocument: {
        value: function() {
            AbstractComponentActionDelegate.prototype.exitDocument.call(this);
            this.removeEventListener("vDevCreated", this, false);
            this.removeEventListener("diskAddedToVDev", this, false);
        }
    },


    handleVDevCreated: {
        value: function (event) {
            var detail = event.detail;

            if (detail) {
                var gridId = detail.sourceComponent.identifier,
                    topologyIdentifiers = Topology.IDENTIFIERS;

                if (topologyIdentifiers[gridId]) {
                    var collectionSource = this.findTopologyCollectionWithIdentifier(gridId),
                        dropZoneId = detail.dropZoneComponent.identifier;

                    if (topologyIdentifiers[dropZoneId]) {
                        var collectionTarget = this.findTopologyCollectionWithIdentifier(dropZoneId),
                            disk = detail.disk,
                            self = this;

                        //Fixme: getDataObject needs to return a promise
                        self.application.dataService.getNewInstanceForType(Model.ZfsVdev).then(function (vDev) {
                            self.removeDiskFromTopologyCollection(disk, collectionSource);

                            self._sectionService.markDiskAsReserved(disk);

                            //here: disk can be a model disk or ZfsVdev
                            vDev.children = [
                                disk.constructor.Type === Model.ZfsVdev ? disk : self._topologyService.diskToVdev(disk)
                            ];

                            collectionTarget.push(vDev);
                        });
                    } else {
                        console.warn("bug -> unknown dropzone : " + dropZoneId);
                    }
                } else {
                    console.warn("bug -> unknown source : " + gridId);
                }
            }
        }
    },


    handleDiskAddedToVDev: {
        value: function (event) {
            var detail = event.detail;

            if (detail) {
                var gridId = detail.sourceComponent.identifier,
                    topologyIdentifiers = Topology.IDENTIFIERS;

                if (topologyIdentifiers[gridId]) {
                    var collectionSource = this.findTopologyCollectionWithIdentifier(gridId),
                        dropZoneId = detail.dropZoneComponent.gridIdentifier;

                    if (topologyIdentifiers[dropZoneId]) {
                        var disk = detail.disk,
                            self = this;

                        this.removeDiskFromTopologyCollection(disk, collectionSource);
                        self._sectionService.markDiskAsReserved(disk);

                        detail.vDevTarget.children.push(
                            disk.constructor.Type === Model.ZfsVdev ?
                            disk : this._topologyService.diskToVdev(disk)
                        );
                    } else {
                        console.warn("bug -> unknown dropzone : " + dropZoneId);
                    }
                } else {
                    console.warn("bug -> unknown source : " + gridId);
                }
            }
        }
    },

    handleDeleteVDevAction: {
        value: function (event) {
            var vDevComponent = event.target.vDevComponent;

            if (vDevComponent && vDevComponent.canRemove) {
                var collection = this.findTopologyCollectionWithIdentifier(vDevComponent.gridIdentifier),
                    vDev = vDevComponent.object,
                    index;

                if ((index = collection.indexOf(vDev)) !== -1) {
                    collection.splice(index, 1);
                    var vDevChildren = vDev.children;

                    for (var i = 0, length = vDevChildren.length; i < length; i++) {
                        if (vDevChildren[i]._disk) {
                            this._sectionService.markDiskAsNonReserved(vDevChildren[i]._disk);
                            vDevChildren[i]._disk.volume = null;
                        }
                    }
                }
            }
        }
    },

    findTopologyCollectionWithIdentifier: {
        value: function (identifier) {
            var topologyIdentifiers = Topology.IDENTIFIERS,
                topology = this.object;

            return  identifier === topologyIdentifiers.DATA ? topology.data :
                    identifier === topologyIdentifiers.SPARE ? topology.spare :
                    identifier === topologyIdentifiers.CACHE ? topology.cache :
                    identifier === topologyIdentifiers.LOG ? topology.log : null;
        }
    },


    removeDiskFromTopologyCollection: {
        value: function (disk, topologyCollection) {
            if (topologyCollection) {
                /* the argument disk can be vdev or disk here */
                var ZfsVdevType = Model.ZfsVdev,
                    ii, ll, vDev, vDevDisks, vDevDisk,
                    promise;

                this._sectionService.markDiskAsNonReserved(disk);

                loop1:
                    for (var i = 0, l = topologyCollection.length; i < l; i++) {
                        vDev = topologyCollection[i];

                        if (vDev.constructor.Type === ZfsVdevType && vDev.children && vDev.children.length > 0) {
                            vDevDisks = vDev.children;

                            for (ii = 0, ll = vDevDisks.length; ii < ll ; ii++) {
                                vDevDisk = vDevDisks[ii];

                                if (vDevDisk === disk) {
                                    if (ll === 1) {
                                        topologyCollection.splice(i, 1);
                                    } else {
                                        vDevDisks.splice(ii, 1);
                                    }

                                    break loop1;
                                }
                            }
                        } else if (vDev === disk || vDev.path === disk.path) {
                            topologyCollection.splice(i, 1);
                            break;
                        }
                    }
            }
        }
    },


    _swapClassNameAccordingToCurrentMode: {
        value: function (previousMode, newMode) {
            if (!this.classList.has(newMode)) {
                if (previousMode) {
                    this.classList.remove(CLASS_NAMES_FOR_MODES[previousMode]);
                }
                this.classList.add(CLASS_NAMES_FOR_MODES[newMode]);
            }
        }
    }

}, {

    MODES: {
        value: {
            READ: "READ",
            CREATE: "CREATE",
            UPDATE: "UPDATE"
        }
    },


    IDENTIFIERS: {
        value: {
            LOG: "LOG",
            SPARE: "SPARE",
            DATA: "DATA",
            CACHE: "CACHE",
            HDDS: "HDDS",
            SSDS: "SSDS"
        }
    },

    VDEV_TYPES: {
        value: {
            DISK: {
                id: 1,
                value: 'disk',
                minDisks: 1,
                maxDisks: 1
            },
            MIRROR: {
                id: 2,
                value: 'mirror',
                minDisks: 2
            },
            RAIDZ1: {
                id: 3,
                value: 'raidz1',
                minDisks: 3
            },
            RAIDZ2: {
                id: 4,
                value: 'raidz2',
                minDisks: 4
            },
            RAIDZ3: {
                id: 5,
                value: 'raidz3',
                minDisks: 5
            }
        }
    }

});
