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
            AbstractDropZoneComponent.prototype.enterDocument.call(this, firstTime);
            this._populateTopologyItem();
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
                    for (var i = 0, l = vDevChildren.length; i < l; i++) {
                        if (targetDisk === vDevChildren[i]) {
                            response = false;
                            break;
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

            this.dispatchOwnPropertyChange("editable", this.editable, false);
            this.dispatchOwnPropertyChange("gridIdentifier", this.gridIdentifier, false);
        }
    }

});
