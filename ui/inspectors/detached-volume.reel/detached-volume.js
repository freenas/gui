/**
 * @module ui/inspectors/detached-volume.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    DiskEraseMethod = require("core/model/enumerations/disk-erase-method").DiskEraseMethod;

/**
 * @class DetachedVolume
 * @extends Component
 */
exports.DetachedVolume = AbstractInspector.specialize(/** @lends DetachedVolume# */ {
    templateDidLoad: {
        value: function() {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                self._volumeService = Volume.services;
                return Model.populateObjectPrototypeForType(Model.Disk);
            }).then(function(Disk) {
                self._diskService = Disk.services;
                self._diskConstructorService = Disk.constructor.services;
            });
        }
    },

    delete: {
        value: function() {
            this._volumeService.deleteExported(this.object.name);
        }
    },

    handleImportAction: {
        value: function () {
            this._volumeService.import(this.object.id, this.object.name);
        }
    }
});
