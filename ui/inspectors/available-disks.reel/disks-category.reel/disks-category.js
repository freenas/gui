var AbstractDropZoneComponent = require("core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Topology = require("ui/controls/topology.reel").Topology;

/**
 * @class DisksCategory
 * @extends Component
 */
exports.DisksCategory = AbstractDropZoneComponent.specialize({

    _topology: {
        value: null
    },

    object: {
        get: function () {
            if (!this._topology) {
                var cascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this);

                if (cascadingListItem) {
                    var previousCascadingListItemContext = cascadingListItem.cascadingList._stack[cascadingListItem.data.columnIndex - 1];
                    this._topology = previousCascadingListItemContext.object.topology;
                }
            }

            return this._topology;
        }
    },

    enterDocument: {
        value: function (firstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, firstTime);
            this._topology = null;
        }
    },

    shouldAcceptComponent: {
        value: function (diskGridItemComponent) {
            var response = true;

            if (response) {
                var vDev = diskGridItemComponent.object,
                    disk = vDev._disk;

                if (disk) {
                    var isSSDDropZone = Topology.IDENTIFIERS.SSDS === this.identifier,
                        isDiskSSD = disk.status.is_ssd;

                    response = ((isSSDDropZone && isDiskSSD) || (!isSSDDropZone && !isDiskSSD));
                } else {
                    response = false;
                }
            }

            return response;
        }
    },

    handleComponentDrop: {
        value: function (diskGridItemComponent) {
            var vDev = diskGridItemComponent.object,
                disk = vDev._disk,
                sourceGridId = diskGridItemComponent.ownerComponent.identifier;

            if (disk && Topology.IDENTIFIERS[sourceGridId]) {
                var collectionSource = Topology.prototype._findTopologyCollectionWithIdentifier.call(this, sourceGridId);
                Topology.prototype._removeDiskFromTopologyCollection(vDev, collectionSource);
                disk.volume = null;
            }
        }
    }

});
