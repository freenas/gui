var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    RoutingService = require("core/service/routing-service").RoutingService,
    DiskAcousticlevel = require("core/model/enumerations/disk-acousticlevel").DiskAcousticlevel;

exports.Disk = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this._routingService = RoutingService.getInstance();
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this.acousticLevelOptions = DiskAcousticlevel.members.map(function(x) {
                return {
                    label: x,
                    value: x
                };
            });
        }
    },

    enterDocument: {
        value: function() {
            this.isDiskEraseConfirmationVisible = false;
            this.populateDiskAllocation();
            if (this.object._volume) {
                this.topologyChangedListener = this._eventDispatcherService.addEventListener('VolumeTopologyChanged-' + this.object._volume.id, this.handleTopologyChanged.bind(this));
            }
        }
    },

    exitDocument: {
        value: function () {
            if (this.object._volume) {
                this._eventDispatcherService.removeEventListener('VolumeTopologyChanged-' + this.object._volume.id, this.topologyChangedListener);
            }
        }
    },

    populateDiskAllocation: {
        value: function () {
            this.object._allocation = this._sectionService.getDiskAllocation(this.object);
            if (this.object._allocation && this.object._allocation.type == 'VOLUME') {
                this.object._vdev = this._sectionService.getVdev(this.object);
            }
        }
    },

    handleTopologyChanged: {
        value: function() {
            this.populateDiskAllocation();
        }
    },

    handleEraseAction: {
        value: function() {
            this.isDiskEraseConfirmationVisible = true;
        }
    },

    cancelDiskErase: {
        value: function() {
            this.isDiskEraseConfirmationVisible = false;
        }
    },

    confirmDiskErase: {
        value: function() {
            return this._sectionService.eraseDisk(this.object);
        }
    },

    handleOfflineAction: {
        value: function() {
            return this._sectionService.offlineDisk(this.object._allocation.name, this.object._vdev);
        }
    },

    handleOnlineAction: {
        value: function() {
            return this._sectionService.onlineDisk(this.object._allocation.name, this.object._vdev);
        }
    }
});
