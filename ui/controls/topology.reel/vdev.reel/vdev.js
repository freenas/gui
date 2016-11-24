/**
 * @module ui/vdev.reel
 */
var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    TopologyItem = require("ui/controls/topology.reel/topology-item.reel").TopologyItem,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Topology = require("ui/controls/topology.reel").Topology,
    AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;


/**
 * @class Vdev
 * @extends Component
 */
exports.Vdev = AbstractDropZoneComponent.specialize(/** @lends Vdev# */ {
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
            return !this.object.isExistingVDev;
        }
    },

    canRemove: {
        get: function () {
            return !(this.isEditorMode && this.gridIdentifier === Topology.IDENTIFIERS.DATA && !this.isNewVDev);
        }
    },

    children: {
        value: null
    },

    vdevTypesOptions: {
        value: null
    },

    _populateDiskPromise: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this.object !== object) {
                this._object = object;
                this.children = object ? object.children : null;
                this._populateDiskWithinVDevIfNeeded();
            }
        },
        get: function () {
            return this._object;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, isFirstTime);
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);

            if (isFirstTime) {
                this._topologyService = this.application.topologyService;
                this.addRangeAtPathChangeListener("children", this, "handleChildrenChange");
                this.addPathChangeListener("object.isExistingVDev", this, "handleIsExistingVDevChange");
                this.addRangeAtPathChangeListener("object.type", this, "_handleObjectTypeChange");
                this.addPathChangeListener("selectedDisk", this, "_handleSelectedDiskChange");
                this.addPathChangeListener("topologyItem.selectedDisk", this, "_handleSelectedDiskChange");
            }

            this._populateDiskWithinVDevIfNeeded();
            this._defineVDevContext();
            this._hasUserDefinedType = false;
        }
    },

    prepareForActivationEvents: {
        value: function() {
            AbstractComponentActionDelegate.prototype.prepareForActivationEvents.call(this);
            this.element.addEventListener('mouseleave', this, false);
        }
    },

    exitDocument: {
        value: function () {
            AbstractDropZoneComponent.prototype.exitDocument.call(this);
            AbstractComponentActionDelegate.prototype.exitDocument.call(this);
            this._topologyItem = void 0;
        }
    },

    /**
     * override _addEventListener
     * Need to manage mouseleave
     */
    _addEventListener: {
        value: function () {
            AbstractComponentActionDelegate.prototype._addEventListener.call(this);
            this.element.addEventListener('mouseleave', this, false);
        }
    },

    /**
     * override _removeEventListenersIfNeeded
     * Need to manage mouseleave
     */
    _removeEventListenersIfNeeded: {
        value: function () {
            AbstractComponentActionDelegate.prototype._removeEventListenersIfNeeded.call(this);

            if (this.preparedForActivationEvents) {
                this.element.removeEventListener('mouseleave', this, false);
            }
        }
    },

    _handleSelectedDiskChange: {
        value: function(value, source) {
            if (this.topologyItem && this.topologyItem.selectedDisk !== this.selectedDisk) {
                if (source === 'selectedDisk' && value) {
                    this.topologyItem.selectedDisk = this.selectedDisk;
                } else {
                    this.selectedDisk = null;
                }
            }
        }
    },

    _populateDiskWithinVDevIfNeeded: {
        value: function () {
            if (this.isEditorMode && this.object && this._inDocument) {
                var self = this;

                (this._populateDiskPromise = this._topologyService.populateDiskWithinVDev(this.object)).then(function () {
                    self._calculateSizes();
                });
            }
        }
    },

    handleIsExistingVDevChange: {
        value: function () {
            this._defineVDevContext();
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
        value: function (addedChildren) {
            if (this.children) {
                this._defineDefaultType(!!addedChildren.length);
                this._calculateSizes();
            }
        }
    },

    _calculateSizes: {
        value: function() {
            if (this.children && this.children[0] && this.children[0]._disk) {
                var diskSize = this.children[0]._disk.mediasize,
                    totalSize = diskSize * this.children.length;
                this.object._paritySize = this._topologyService.getParitySizeOnTotal(this.children.length, this.object.type, totalSize);
                var storageSize = totalSize - this.object._paritySize;
                this.object._usedSize = 0;
                this.object._availableSize = storageSize - this.object._usedSize;
            } else if (this.object.stats) {
                var allocatedSize = this.object.stats.allocated;
                this.object._paritySize = this._topologyService.getParitySizeOnAllocated(this.children.length, this.object.type, allocatedSize);
                this.object._usedSize = allocatedSize - this.object._paritySize;
                this.object._availableSize = this.object.stats.size - allocatedSize;
            }
        }
    },

    _defineDefaultType: {
        value: function(isAdd) {
            if (this.topologyItem && !this._hasUserDefinedType) {
                var childrenCount = this.children.length;

                if (this.isEditorMode && !this.isNewVDev) {
                    if (!this.isVDevRaidZType) {
                        this.object.type = childrenCount > 1 ? Topology.VDEV_TYPES.MIRROR.value : Topology.VDEV_TYPES.DISK.value;
                    }
                } else {
                    var allowedDefaultVdevTypesValues = this.topologyItem.allowedDefaultVdevTypes.filter(function(x) { return childrenCount >= x.minDisks; }).map(function(x) { return x.value; });
                    if (!this.object.type || !isAdd || allowedDefaultVdevTypesValues.indexOf(this.object.type) != -1) {
                        this.object.type = allowedDefaultVdevTypesValues[0];
                    }
                }
            }
        }
    },

    _defineVDevContext: {
        value: function () {
            if (this._inDocument && this.object) {
                var allowedVDevTypes = null;

                this.dispatchOwnPropertyChange("isNewVDev", this.isNewVDev);
                this.dispatchOwnPropertyChange("isVDevImmutable", this.isVDevImmutable);
                this.dispatchOwnPropertyChange("canRemove", this.canRemove);

                if (this.isEditorMode && !this.isNewVDev && this.gridIdentifier === Topology.IDENTIFIERS.DATA) {
                    var type = this.object.type;

                    if (type === Topology.VDEV_TYPES.DISK.value) {
                        allowedVDevTypes = [Topology.VDEV_TYPES.DISK, Topology.VDEV_TYPES.MIRROR];

                    } else if (type === Topology.VDEV_TYPES.RAIDZ3.value) {
                        allowedVDevTypes = [Topology.VDEV_TYPES.RAIDZ3];
                    } else if (type === Topology.VDEV_TYPES.RAIDZ2.value) {
                        allowedVDevTypes = [Topology.VDEV_TYPES.RAIDZ2];
                    } else if (type === Topology.VDEV_TYPES.RAIDZ1.value) {
                        allowedVDevTypes = [Topology.VDEV_TYPES.RAIDZ1];
                    } else if (type === Topology.VDEV_TYPES.MIRROR.value) {
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
        }
    },

    _handleObjectTypeChange: {
        value: function () {
            this._calculateSizes();
        }
    },

    gridItemDidEnter: {
        value: function(gridItem) {
            gridItem.classList.remove('unhealthy');
            if (this._populateDiskPromise || gridItem.object && gridItem.object._disk) {
                var promise = this._populateDiskPromise || Promise.resolve();
                promise.then(function() {
                    if (gridItem.object.getPath('_disk.status.smart_info.smart_status') === 'FAIL') {
                        gridItem.classList.add('unhealthy');
                    }
                });
            }
        }
    }

});
