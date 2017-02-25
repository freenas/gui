var Component = require("montage/ui/component").Component,
    BytesConverter = require("montage/core/converter/bytes-converter").BytesConverter,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DiskRepository = require("core/repository/disk-repository").DiskRepository;

/**
 * @class Disk
 * @extends Component
 */
exports.Disk = Component.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
            }
        },
        get: function () {
            return this._object;
        }
    },

    templateDidLoad: {
        value: function() {
            this._diskRepository = DiskRepository.getInstance();
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function() {
            this._handleDiskChange();
            this.eventListener = this._eventDispatcherService.addEventListener(ModelEventName.Disk.change(this.object.id), this._handleDiskChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.Disk.change(this.object.id), this.eventListener);
            if (this.topologyEventListener && allocation) {
                this._eventDispatcherService.removeEventListener('VolumeTopologyChanged-' + this.object._allocation.name, this.topologyEventListener);
            }
        }
    },

    _handleDiskChange: {
        value: function() {
            var oldallocation;
            if (this.object._allocation) {
                oldallocation = this.object._allocation;
            }
            this.object._allocation = this._diskRepository.getDiskAllocation(this.object);
            if (this.object._allocation && this.object._allocation.type == 'VOLUME') {
                this.topologyEventListener = this.eventDispatcherService.addEventListener('VolumeTopologyChanged-' + this.object._allocation.name, this.handleVdevChange.bind(this));
            } else {
                if (this.topologyEventListener && oldallocation) {
                    this._eventDispatcherService.removeEventListener('VolumeTopologyChanged-' + oldallocation.name, this.topologyEventListener);
                    delete this.topologyEventListener;
                }
            }
        }
    },

    handleVdevChange: {
        value: function(topology) {
            var vdev = this._sectionService.getVdevFromTopology(this.object._disk.path, topology.toJS());
            // not sure what to do with vdev yet since it never gets here
        }
    },

});

exports.defaultBytesConverter = {
    _converter: new BytesConverter(),
    convert: function(size) {
        var tmp = size,
            magnitude = 0;
        while (tmp >= 1) {
            magnitude++;
            tmp = tmp / 1024;
        }
        if (tmp >= 0.01) {
            tmp = Math.round(tmp * 1024) * Math.pow(1024, magnitude - 1);
        } else {
            tmp = size;
        }
        return this._converter.convert(tmp);
    },

    revert: function(string) {
        return this._converter.revert(string);
    }
};
