/**
 * @module ui/topology.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;


var ClASS_NAMES_FOR_MODES = {
    READ: "read-mode",
    CREATE: "create-mode",
    UPDATE: "update-mode"
};


/**
 * @class Topology
 * @extends Component
 */
var Topology = exports.Topology = Component.specialize({

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


    enterDocument: {
        value: function() {
            this.addEventListener("vDevCreated", this, false);
            this.addEventListener("diskAddedToVDev", this, false);
        }
    },


    exitDocument: {
        value: function() {
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
                    var collectionSource = this._findTopologyCollectionWithIdentifier(gridId),
                        dropZoneId = detail.dropZoneComponent.identifier;

                    if (topologyIdentifiers[dropZoneId]) {
                        var collectionTarget = this._findTopologyCollectionWithIdentifier(dropZoneId),
                            disk = detail.disk,
                            self = this;

                        if (dropZoneId === Topology.IDENTIFIERS.SPARE) {
                            this._removeDiskFromTopologyCollection(disk, collectionSource);
                            collectionTarget.push(disk);

                        } else {
                            //Fixme: getDataObject needs to return a promise
                            Model.populateObjectPrototypeForType(Model.ZfsVdev).then(function () {
                                var vDev = self.application.dataService.getDataObject(Model.ZfsVdev);
                                vDev.children = [disk];

                                self._removeDiskFromTopologyCollection(disk, collectionSource);
                                collectionTarget.push(vDev);
                            });
                        }
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
                    var collectionSource = this._findTopologyCollectionWithIdentifier(gridId),
                        dropZoneId = detail.dropZoneComponent.gridIdentifier;

                    if (topologyIdentifiers[dropZoneId]) {
                        var disk = detail.disk;

                        this._removeDiskFromTopologyCollection(disk, collectionSource);
                        detail.vDevTarget.children.push(disk);
                    } else {
                        console.warn("bug -> unknown dropzone : " + dropZoneId);
                    }
                } else {
                    console.warn("bug -> unknown source : " + gridId);
                }
            }
        }
    },


    _findTopologyCollectionWithIdentifier: {
        value: function (identifier) {
            var topologyIdentifiers = Topology.IDENTIFIERS,
                topology = this.object;

            return  identifier === topologyIdentifiers.DATA ? topology.data :
                    identifier === topologyIdentifiers.SPARE ? topology.spare :
                    identifier === topologyIdentifiers.CACHE ? topology.cache : topology.log;
        }
    },


    _removeDiskFromTopologyCollection: {
        value: function (disk, topologyCollection) {
            var ZfsVdevType = Model.ZfsVdev,
                ii, ll, vDev, vDevDisks, vDevDisk;

            loop1:
                for (var i = 0, l = topologyCollection.length; i < l; i++) {
                    vDev = topologyCollection[i];

                    if (Object.getPrototypeOf(vDev).Type === ZfsVdevType) {
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
                    } else if (vDev === disk) {
                        topologyCollection.splice(i, 1);
                        break;
                    }
                }
        }
    },


    _swapClassNameAccordingToCurrentMode: {
        value: function (previousMode, newMode) {
            if (!this.classList.has(newMode)) {
                if (previousMode) {
                    this.classList.remove(ClASS_NAMES_FOR_MODES[previousMode]);
                }
                this.classList.add(ClASS_NAMES_FOR_MODES[newMode]);
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
            CACHE: "CACHE"
        }
    }

});
