 /**
 * @module ui/topology.reel
 */
var Component = require("montage/ui/component").Component,
    VolumeCreator = require("ui/inspectors/volume-creator.reel").VolumeCreator,
    Promise = require("montage/core/promise").Promise,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Model = require("core/model/model").Model;

/**
 * @class Topology
 * @extends Component
 */
var Topology = exports.Topology = Component.specialize(/** @lends Topology# */ {

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
                this._topologyProxy = null;
                this._populateTopologyProxyWithTopology(object);
            }
        },
        get: function () {
            return this._object;
        }
    },

    _topologyProxy: {
        value: null
    },

    topologyProxy: {
        get: function () {
            if (!this._topologyProxy) {
                var self = this;

                this._topologyProxy = Promise.all([
                    Model.populateObjectPrototypeForType(Model.ZfsTopology),
                    Model.populateObjectPrototypeForType(Model.ZfsVdev)
                ]).then(function () {
                    self._topologyProxy = self._getNewTopologyProxy();
                });
            }

            return this._topologyProxy;
        }
    },

    exitDocument: {
        value: function () {
            this._clearDisk();
            this._freeTopologyProxy();
        }
    },

    _freeTopologyProxy: {
        value: function () {
            if (this._topologyProxy) {
                var topologyKeys = this.constructor.TOPOLOGY_KEYS;

                for (var i = 0, l = topologyKeys.length; i < l; i++) {
                    this._topologyProxy[topologyKeys[i]].clear();
                }
            }
        }
    },

    _populateTopologyProxyWithTopology: {
        value: function (topology) {
            if (this.topologyProxy) {
                if (Promise.is(this.topologyProxy)) {
                    var self = this;

                    this.topologyProxy.then(function () {
                        self.__populateTopologyProxyWithTopology(topology);
                    });
                } else {
                    this.__populateTopologyProxyWithTopology(topology);
                }
            }
        }
    },

    __populateTopologyProxyWithTopology: {
        value: function (topology) {
            this._mapTopologyToTopologyProxy(topology, this._topologyProxy);
            this.dispatchOwnPropertyChange("topologyProxy", this._topologyProxy);
        }
    },

    _mapTopologyToTopologyProxy: {
        value: function (topology, topologyProxy) {
            var topologyKeys = this.constructor.TOPOLOGY_KEYS;

            for (var i = 0, l = topologyKeys.length; i < l; i++) {
                this.addVDevsToTopologyProxyVDevs(topology[topologyKeys[i]], topologyProxy[topologyKeys[i]]);
            }
        }
    },

    _getNewTopologyProxy: {
        value: function () {
            var topologyProxy = this.application.dataService.getDataObject(Model.ZfsTopology),
                topologyKeys = this.constructor.TOPOLOGY_KEYS;

            for (var i = 0, l = topologyKeys.length; i < l; i++) {
                topologyProxy[topologyKeys[i]] = [];
            }

            return topologyProxy;
        }
    },

    addVDevsToTopologyProxyVDevs: {
        value: function (vDevs, targetProxyVDevs) {
            var proxyVDev, proxyVDevDisk, vDev, vDevChildren, i, ii , l, ll;

            for (i = 0, l = vDevs.length; i < l; i++) {
                proxyVDev = this._mapVDevToProxyVDev((vDev = vDevs[i]));
                proxyVDev.children = [];
                vDevChildren = vDev.children;
                proxyVDev.isExistingVDev = true;

                if (!vDevChildren || vDevChildren.length === 0) {
                    proxyVDev.children.push(vDev);
                } else {
                    for (ii = 0, ll = vDevChildren.length; ii < ll; ii++) {
                        proxyVDevDisk = this._mapVDevToProxyVDev(vDevChildren[ii]);
                        proxyVDev.children.push(proxyVDevDisk);
                    }
                }

                targetProxyVDevs.push(proxyVDev);
            }
        }
    },

    _mapVDevToProxyVDev: {
        value: function (vDev) {
            var propertyBlueprints = Model.ZfsVdev.objectPrototype.blueprint.propertyBlueprints,
                proxyVDev = this.application.dataService.getDataObject(Model.ZfsVdev),
                key;

            for (var i = 0, length = propertyBlueprints.length; i < length; i++) {
                key = propertyBlueprints[i].name;

                if (key !== "children") {
                    proxyVDev[key] = vDev[key];
                }
            }

            return proxyVDev;
        }
    },

    revert: {
        value: function () {
            this._clearDisk();
            this._freeTopologyProxy();
            this._populateTopologyProxyWithTopology(this.object);
        }
    },

    _clearDisk: {
        value: function () {
            var disks = this.availableDisks,
                disk;

            if (disks) {
                for (var i = 0, length = disks.length; i < length; i++) {
                    disk = disks[i];

                    if (disk.volume === '/TEMP/') {
                        disk.volume = null;
                    }
                }
            }
        }
    },

    _updateTopologyProxyAfterSaving: {
        value: function () {
            var topologyKeys = this.constructor.TOPOLOGY_KEYS;

            for (var i = 0, l = topologyKeys.length; i < l; i++) {
                this._cleanupVdevs(this.topologyProxy[topologyKeys[i]]);
            }
        }
    },

    _populateMissingGuidToTopologyProxy: {
        value: function (initialTopology) {
            var mapPathToVdev = new Map(),
                topologyKeys = this.constructor.TOPOLOGY_KEYS,
                vDevs, vDev, i, ii, l, ll, vDevTmp;

            for (i = 0, l = topologyKeys.length; i < l; i++) {
                vDevs = initialTopology[topologyKeys[i]];

                for (ii = 0, ll = vDevs.length; ii < ll; ii++) {
                    vDev = vDevs[ii];

                    mapPathToVdev.set(vDev.path, vDev);
                }
            }

            for (i = 0, l = topologyKeys.length; i < l; i++) {
                vDevs = this.topologyProxy[topologyKeys[i]];

                for (ii = 0, ll = vDevs.length; ii < ll; ii++) {
                    vDev = vDevs[ii];

                    if (!vDev.guid) {
                        vDev.guid = (vDevTmp = mapPathToVdev.get(vDev.path)) ? vDevTmp.guid : void 0;
                    }
                }
            }
        }
    },

    save: {
        value: function () {
            var previousContextCascadingList = CascadingList.findPreviousContextWithComponent(this);

            if (previousContextCascadingList) {
                var volume = previousContextCascadingList.object,
                    topologyKeys = this.constructor.TOPOLOGY_KEYS,
                    previousTopology = this.object,
                    self = this;

                for (var i = 0, l = topologyKeys.length; i < l; i++) {
                    this._cleanupVdevs(this.topologyProxy[topologyKeys[i]]);
                }

                this._populateMissingGuidToTopologyProxy(volume.topology);

                volume._topology = this.topologyProxy;

                // FIXME: Remove once the middleware stops sending erroneous data
                if (!volume.providers_presence) {
                    volume.providers_presence = 'NONE';
                }

                this.isLocked = true;
                return this.application.dataService.saveDataObject(volume).then(function () {
                    if (self._inDocument) {
                        var context = CascadingList.findCascadingListItemContextWithComponent(self);

                        if (context) {
                            context.object = context.data.object = self.topologyProxy;
                        }
                    }
                }, function () {
                    volume.topology = previousTopology;
                });
            }
        }
    }


}, {

    TOPOLOGY_KEYS: {
        value: ["data", "cache", "log", "spare"]
    }

});


Topology.prototype._cleanupVdevs = VolumeCreator.prototype._cleanupVdevs;
