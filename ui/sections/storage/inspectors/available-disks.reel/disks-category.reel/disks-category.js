var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    Topology = require("ui/controls/topology.reel").Topology,
    _ = require('lodash');

/**
 * @class DisksCategory
 * @extends Component
 */
exports.DisksCategory = AbstractDropZoneComponent.specialize({

    shouldAcceptComponent: {
        value: function (diskGridItemComponent) {
            var response;
            if (this.controller && typeof this.controller.shouldAcceptComponentInDiskCategory === 'function') {
                response = this.controller.shouldAcceptComponentInDiskCategory(diskGridItemComponent, this);
            } else {
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
            if (this.controller && typeof this.controller.handleComponentDropInDiskCategory === 'function') {
                this.controller.handleComponentDropInDiskCategory(diskGridItemComponent, this);
            } else {
                var vDev = diskGridItemComponent.object,
                    disk = vDev._disk,
                    sourceGridId = diskGridItemComponent.ownerComponent.identifier;

                if (disk && Topology.IDENTIFIERS[sourceGridId]) {
                    var collectionSource = this.topology.findTopologyCollectionWithIdentifier.call(this.topology, sourceGridId);
                    this.topology.removeDiskFromTopologyCollection(vDev, collectionSource);
                    disk.volume = null;
                }
            }
        }
    },

    isExpanded: {
        value: true
    },

    handleButtonAction: {
        value: function () {
            this.isExpanded = !this.isExpanded;
        }
    },

    gridItemDidEnter: {
        value: function(gridItem) {
            if (_.get(gridItem.object, 'status.smart_info.smart_status') === 'FAIL') {
                gridItem.classList.add('unhealthy');
            } else {
                gridItem.classList.remove('unhealthy');
            }
        }
    }

});
