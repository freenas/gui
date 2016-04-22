var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class VolumeCreator
 * @extends Component
 */
exports.VolumeCreator = Component.specialize({


    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object != object) {
                this._object = this._initializeTopology(object);
            }
        }
    },

    _initializeTopology: {
        value: function (object) {
            object = object || this._object;
            object.topology = this.application.dataService.getDataObject(Model.ZfsTopology);
            object.topology.cache = [];
            object.topology.data = [];
            object.topology.log = [];
            object.topology.spare = [];

            if (this.disks) {
                this.disks.filter(function(x) { return x.volume == '/TEMP/'; }).forEach(function(x) { x.volume = null; });
            }
            return object;
        }
    },

    _getDefaultVdevType: {
        value: function(disksCount) {
            var type;
            if (disksCount >=3) {
                type = 'raidz1'
            } else if (disksCount == 2) {
                type = 'mirror'
            } else {
                type = 'disk'
            }
            return type;
        }
    },

    _cleanupVdevs: {
        value: function (storageType) {
            var i, vdevsLength, vdev,
                j, disksLength, disk,
                type, path;
            for (i = 0, vdevsLength = storageType.length; i < vdevsLength; i++) {
                vdev = storageType[i];
                if (vdev.children) {
                    for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                        disk = vdev.children[j];
                        path = disk.path;
                        if (path.indexOf('/dev/') != 0) {
                            path = '/dev/' + path;
                        }
                        vdev.children[j].path = path;
                    }
                    if (vdev.children.length == 1) {
                        vdev.path = vdev.children[0].path;
                        vdev.children = [];
                    }
                }
            }
            return storageType;
        }
    },

    _cleanupTopology: {
        value: function() {
            this.object.topology = {
                data: this._cleanupVdevs(this.object.topology.data),
                cache: this._cleanupVdevs(this.object.topology.cache),
                log: this._cleanupVdevs(this.object.topology.log),
                spare: this._cleanupVdevs(this.object.topology.spare)
            };
        }
    },

    revert: {
        value: function() {
            this.topologizer.reset();
            this._initializeTopology();
        }
    },

    save: {
        value: function() {
            //this._cleanupTopology();
            this._cleanupVdevs(this.object.topology.data);
            this._cleanupVdevs(this.object.topology.cache);
            this._cleanupVdevs(this.object.topology.log);
            this._cleanupVdevs(this.object.topology.spare);
            this.object.type = 'zfs';
            this.object._isNew = true;
            return this.application.dataService.saveDataObject(this.object);
        }
    }

});
