/**
 * @module ui/vdev.reel
 */
var AbstractDropZoneComponent = require("core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    TopologyItem = require("ui/controls/topology.reel/topology-item.reel").TopologyItem,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Topology = require("ui/controls/topology.reel").Topology,
    TopologyService = require("core/volumes/topology-service").TopologyService;

/**
 * @class Vdev
 * @extends Component
 */
exports.Vdev = AbstractDropZoneComponent.specialize(/** @lends Vdev# */ {

    RECORD_SIZE: {
        value: 128
    },

    _topologyItem: {
        value: void 0
    },


    topologyItem: {
        get: function () {
            if (!this._topologyItem && this._inDocument) {
                var topologyItem = null,
                    currentComponent = this.parentComponent || this.findParentComponent();

                while (!topologyItem && currentComponent) {
                    if (currentComponent instanceof TopologyItem) {
                        topologyItem = currentComponent;
                    }
                    currentComponent = currentComponent.parentComponent;
                }

                if (!topologyItem) {
                    throw new Error("Vdev component cannot used outside TopologyItem component");
                }

                this._topologyItem = topologyItem;
            }

            return this._topologyItem;
        }
    },


    gridIdentifier: {
        get: function () {
            if (this.topologyItem) {
                return this.topologyItem.gridIdentifier;
            }
        }
    },

    editable: {
        get: function () {
            if (this.topologyItem) {
                return this.topologyItem.editable;
            }
        }
    },

    mode: {
        get: function () {
            if (this.topologyItem) {
                return this.topologyItem.topologyComponent.mode;
            }
        }
    },

    isEditorMode: {
        get: function () {
            return this.mode === Topology.MODES.UPDATE;
        }
    },

    isVDevImmutable: {
        get: function () {
            return this.isEditorMode && this.gridIdentifier === Topology.IDENTIFIERS.DATA && this.isVDevRaidZType && !this.isNewVDev;
        }
    },

    isVDevRaidZType: {
        get: function () {
            var type = this.object.type,
                vDevTypes = Topology.VDEV_TYPES;

            return type === vDevTypes.RAIDZ1.value || type === vDevTypes.RAIDZ2.value || type === vDevTypes.RAIDZ3.value;
        }
    },

    isNewVDev: {
        get: function () {
            return this.object ? !this.object.guid : true;
        }
    },

    children: {
        value: null
    },

    vdevTypesOptions: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            this._object = object;
            this.children = object ? object.children : null;
        },
        get: function () {
            return this._object;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, isFirstTime);

            if (isFirstTime) {
                this._topologyService = TopologyService.instance;
            }

            if (this.isEditorMode) {
                var self = this;

                this._topologyService.populateDiskWithinVDev(this.object).then(function () {
                    self._calculateSizes();
                });
            }

            this._defineVDevContext();
            this._cancelRangeAtPathChangeListener = this.addRangeAtPathChangeListener("children", this, "handleChildrenChange");
            this._hasUserDefinedType = false;
            this.canRemove = !(this.isEditorMode && this.gridIdentifier === Topology.IDENTIFIERS.DATA && !this.isNewVDev);
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this.element.addEventListener('mouseleave', this, false);
        }
    },

    exitDocument: {
        value: function () {
            AbstractDropZoneComponent.prototype.exitDocument.call(this);
            this._cancelRangeAtPathChangeListener();
            this._topologyItem = void 0;
        }
    },

    shouldAcceptComponent: {
        value: function (diskGridItemComponent) {
            var response = this.editable;

            if (response) {
                /* targetDisk can be vdev or disk here */
                var targetDisk = diskGridItemComponent.object,
                    vDevChildren = this.children;

                if (vDevChildren) {
                    if (!this.topologyItem.maxVdevType.maxDisks || vDevChildren.length < this.topologyItem.maxVdevType.maxDisks) {
                        if (this.isEditorMode && this.gridIdentifier === Topology.IDENTIFIERS.DATA) {
                            response = !this.isVDevImmutable;
                        }

                        if (response) {
                            response = vDevChildren.indexOf(targetDisk) === -1;
                        }
                    } else {
                        response = false;
                    }
                }
            }

            return response;
        }
    },

    shouldAcceptGridItemToDrag: {
        value: function (diskGridItemComponent) {
            var response = this.editable;

            if (this.isEditorMode && !this.isNewVDev && this.gridIdentifier === Topology.IDENTIFIERS.DATA) {
                response = !this.isVDevImmutable;

                if (response) {
                    var context = CascadingList.findCascadingListItemContextWithComponent(this);

                    if (context) {
                        var initialDataTopology = context.object.data,
                            targetDisk = diskGridItemComponent.object,
                            vDev, vDevChildren, ii, ll;

                        loop1:
                        for (var i = 0, l = initialDataTopology.length; i < l; i++) {
                            vDev = initialDataTopology[i];
                            vDevChildren = vDev.children;

                            if (vDevChildren && vDevChildren.length > 1) {
                                for (ii = 0, ll = vDevChildren.length; ii < ll; ii++) {
                                    if (vDevChildren[ii].guid === targetDisk.guid) {
                                        response = false;
                                        break loop1;
                                    }
                                }
                            } else if (vDev === targetDisk) {
                                response = false;
                                break;
                            }
                        }
                    }
                }
            }

            return response;
        }
    },

    handleComponentDrop: {
        value: function (diskGridItemComponent) {
            this.dispatchEventNamed("diskAddedToVDev", true, true, {
                disk: diskGridItemComponent.object,
                sourceComponent: diskGridItemComponent.ownerComponent,
                dropZoneComponent: this,
                vDevTarget: this.object
            });
            this._defineDefaultType();
        }
    },

    handleChildrenChange: {
        value: function () {
            if (this.children) {
                this._defineDefaultType();
                this._calculateSizes();
            }
        }
    },

    _calculateSizes: {
        value: function() {
            if (this.children[0] && this.children[0]._disk) {
                var diskSize = this.children[0]._disk.mediasize,
                    totalSize = diskSize * this.children.length;
                this.object._paritySize = this._getParitySizeOnTotal(this.children.length, this.object.type, totalSize);
                var storageSize = totalSize - this.object._paritySize;
                this.object._usedSize = 0;
                this.object._availableSize = storageSize - this.object._usedSize;
            } else if (this.object.stats) {
                var allocatedSize = this.object.stats.allocated;
                this.object._paritySize = this._getParitySizeOnAllocated(this.children.length, this.object.type, allocatedSize);
                this.object._usedSize = allocatedSize - this.object._paritySize;
                this.object._availableSize = this.object.stats.size - allocatedSize;
            }
        }
    },

    _getParitySizeOnAllocated: {
        value: function(disksCount, vdevType, allocatedSize) {
            var paritySize = 0;
            switch (vdevType) {
                case 'disk':
                    break;
                case 'mirror':
                    paritySize = allocatedSize / 2;
                    break;
                case 'raidz1':
                    paritySize = this._getRaidzParityRatioOnAllocated(disksCount, 1) * allocatedSize;
                    break;
                case 'raidz2':
                    paritySize = this._getRaidzParityRatioOnAllocated(disksCount, 2) * allocatedSize;
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

    _getParitySizeOnTotal: {
        value: function(disksCount, vdevType, totalSize) {
            var paritySize = 0;
            switch (vdevType) {
                case 'disk':
                    break;
                case 'mirror':
                    paritySize = totalSize / 2;
                    break;
                case 'raidz1':
                    paritySize = this._getRaidzParityRatioOnTotal(disksCount, 1) * totalSize;
                    break;
                case 'raidz2':
                    paritySize = this._getRaidzParityRatioOnTotal(disksCount, 2) * totalSize;
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

    _defineDefaultType: {
        value: function() {
            if (this.topologyItem && !this._hasUserDefinedType) {
                var childrenCount = this.children.length;

                if (this.isEditorMode && !this.isNewVDev) {
                    if (!this.isVDevRaidZType) {
                        this.object.type = childrenCount > 1 ? Topology.VDEV_TYPES.MIRROR.value : Topology.VDEV_TYPES.DISK.value;
                    }
                } else {
                    this.object.type = this.topologyItem.allowedDefaultVdevTypes.filter(function(x) { return childrenCount >= x.minDisks; })[0].value;
                }
            }
        }
    },

    _defineVDevContext: {
        value: function () {
            var allowedVDevTypes = null;

            if (this.isEditorMode && !this.isNewVDev && this.gridIdentifier === Topology.IDENTIFIERS.DATA) {
                var type = this.object.type;

                if (type === Topology.VDEV_TYPES.DISK.value) {
                    allowedVDevTypes = [Topology.VDEV_TYPES.DISK, Topology.VDEV_TYPES.MIRROR];

                } else if (type === Topology.VDEV_TYPES.MIRROR) {
                    allowedVDevTypes = [Topology.VDEV_TYPES.MIRROR];
                } else {
                    allowedVDevTypes = [Topology.VDEV_TYPES.DISK];
                }
            }

            this.vdevTypes = allowedVDevTypes || this.topologyItem.allowedVdevTypes;
            this.disksGrid.delegate = this;
            this.disksGrid.itemDraggable = this.editable;
            this.disksGrid.identifier = this.gridIdentifier;
        }
    },

    handleDisplayVdevTypesAction: {
        value: function (event) {
            this.showVdevTypes = !this.showVdevTypes;
        }
    },

    handleMouseleave: {
        value: function() {
            this.showVdevTypes = false;
        }
    },

    handleVdevTypeButtonAction: {
        value: function(event) {
            this.object.type = event.target.value;
            this._hasUserDefinedType = true;
            this.showVdevTypes = false;
        }
    }

});
