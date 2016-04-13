/**
 * @module ui/vdev.reel
 */
var AbstractDropZoneComponent = require("core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    TopologyItem = require("ui/controls/topology.reel/topology-item.reel").TopologyItem;

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

    gridIdentifier: {
        get: function () {
            if (this._topologyItem) {
                return this._topologyItem.gridIdentifier;
            }
        }
    },

    editable: {
        get: function () {
            if (this._topologyItem) {
                return this._topologyItem.editable;
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            this._populateTopologyItem();
            AbstractDropZoneComponent.prototype.enterDocument.call(this, firstTime);
            this.addRangeAtPathChangeListener("children", this, "handleChildrenChange");
            this._hasUserDefinedType = false;

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
            this._topologyItem = void 0;
        }
    },

    shouldAcceptComponent: {
        value: function (diskGridItemComponent) {
            var response = this.editable;

            if (response) {
                /* targetDisk can be vdev or disk here */
                var targetDisk = diskGridItemComponent.object,
                    vDevChildren = this.object.children;

                if (vDevChildren) {
                    if (!this._topologyItem.maxVdevType.maxDisks || vDevChildren.length < this._topologyItem.maxVdevType.maxDisks) {
                        for (var i = 0, l = vDevChildren.length; i < l; i++) {
                            if (targetDisk === vDevChildren[i]) {
                                response = false;
                                break;
                            }
                        }
                    } else {
                        response = false;
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
        value: function() {
            this._defineDefaultType();
            this._calculateSizes();
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
            if (this._topologyItem && !this._hasUserDefinedType) {
                var childrenCount = this.children.length;
                this.object.type = this._topologyItem.allowedDefaultVdevTypes.filter(function(x) { return childrenCount >= x.minDisks; })[0].value;
            }
        }
    },

    _populateTopologyItem: {
        value: function () {
            var topologyItem = null,
                currentComponent = this;

            while (!topologyItem && currentComponent && currentComponent.parentComponent) {
                currentComponent = currentComponent.parentComponent;

                if (currentComponent instanceof TopologyItem) {
                    topologyItem = currentComponent;
                }
            }

            this._topologyItem = topologyItem;
            this.vdevTypes = topologyItem.allowedVdevTypes;

            this.disksGrid.itemDraggable = this.editable;
            this.disksGrid.identifier = this.gridIdentifier;
        }
    },

    handleDisplayVdevTypesAction: {
        value: function(event) {
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
