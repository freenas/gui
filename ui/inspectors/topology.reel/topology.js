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
                this._freeTopologyProxy();
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
                    self._topologyProxy = self.application.dataService.getDataObject(Model.ZfsTopology);
                    self._topologyProxy.cache = [];
                    self._topologyProxy.log = [];
                    self._topologyProxy.spare = [];
                    self._topologyProxy.data = [];
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
                this._topologyProxy.cache.clear();
                this._topologyProxy.log.clear();
                this._topologyProxy.spare.clear();
                this._topologyProxy.data.clear();
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
            var topologyProxy = this._topologyProxy;

            this.addVDevsToTopologyProxyVDevs(topology.data, topologyProxy.data);
            this.addVDevsToTopologyProxyVDevs(topology.log, topologyProxy.log);
            this.addVDevsToTopologyProxyVDevs(topology.spare, topologyProxy.spare);
            this.addVDevsToTopologyProxyVDevs(topology.cache, topologyProxy.cache);

            this.dispatchOwnPropertyChange("topologyProxy", this._topologyProxy);
        }
    },

    addVDevsToTopologyProxyVDevs: {
        value: function (vDevs, targetProxyVDevs) {
            var proxyVDev, proxyVDevDisk, vDev, vDevChildren, i, ii , l, ll;

            for (i = 0, l = vDevs.length; i < l; i++) {
                proxyVDev = this._mapVDevToProxyVDev((vDev = vDevs[i]));
                proxyVDev.children = [];
                vDevChildren = vDev.children;

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

    save: {
        value: function () {
            var previousContextCascadingList = CascadingList.findPreviousContextWithComponent(this);

            if (previousContextCascadingList) {
                var volume = previousContextCascadingList.object,
                    previousTopology = this.object;

                this._cleanupVdevs(this.topologyProxy.data);
                this._cleanupVdevs(this.topologyProxy.cache);
                this._cleanupVdevs(this.topologyProxy.log);
                this._cleanupVdevs(this.topologyProxy.spare);

                volume._topology = this.topologyProxy;

                // FIXME: Remove once the middleware stops sending erroneous data
                if (!volume.providers_presence) {
                    volume.providers_presence = 'NONE';
                }

                return this.application.dataService.saveDataObject(volume).then(function () {
                    console.log("updated")

                }, function () {
                    volume.topology = previousTopology;
                });
            }
        }
    }



});


Topology.prototype._cleanupVdevs = VolumeCreator.prototype._cleanupVdevs;
