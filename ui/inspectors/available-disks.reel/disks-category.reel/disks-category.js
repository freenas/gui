var AbstractDropZoneComponent = require("core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    Topology = require("ui/controls/topology.reel").Topology;

/**
 * @class DisksCategory
 * @extends Component
 */
exports.DisksCategory = AbstractDropZoneComponent.specialize({

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
                var collectionSource = Topology.prototype._findTopologyCollectionWithIdentifier.call(this.parentComponent, sourceGridId);
                Topology.prototype._removeDiskFromTopologyCollection(vDev, collectionSource);
                disk.volume = null;
            }
        }
    }

});
