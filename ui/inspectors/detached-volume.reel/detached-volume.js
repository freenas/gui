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
            var topology = this.object.topology;
            this._eraseVdevsDisks(topology.data);
            this._eraseVdevsDisks(topology.cache);
            this._eraseVdevsDisks(topology.log);
        }
    },

    handleImportAction: {
        value: function () {
            this._volumeService.import(this.object.id, this.object.name);
        }
    },

    _eraseVdevsDisks: {
        value: function(vdevs) {
            if (vdevs) {
                var self = this,
                    i, vdevLength, vdev,
                    j, disksLength, disk,
                    path;
                for (i = 0, vdevLength = vdevs.length; i < vdevLength; i++) {
                    vdev = vdevs[i];
                    if (vdev.path) {
                        this._diskConstructorService.pathToId(vdev.path).then(function(diskId) {
                            self._diskService.erase(diskId, DiskEraseMethod.QUICK);
                        })
                    } else {
                        for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                            disk = vdev.children[j];
                            this._diskConstructorService.pathToId(disk.path).then(function(diskId) {
                                self._diskService.erase(diskId, DiskEraseMethod.QUICK);
                            })
                        }
                    }
                }
            }
        }
    }
});
