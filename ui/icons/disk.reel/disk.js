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
        }
    },

    _handleDiskChange: {
        value: function() {
            this.object._allocation = this._diskRepository.getDiskAllocation(this.object);
        }
    }

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
