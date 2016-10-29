var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class VolumeCreator
 * @extends Component
 */
exports.VolumeCreator = AbstractInspector.specialize({


    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            var self = this;
            if (this._object != object) {
                if (!object.topology) {
                    this._initializeTopology(object).then(function(_object) {
                        self.object = _object;
                    });
                } else {
                    self._object = object;
                }
            }
        }
    },

    _parentCascadingListItem: {
        value: null
    },

    exitDocument: {
        value: function() {
            this.super();
            if (this._parentCascadingListItem) {
                this._parentCascadingListItem.classList.remove("CascadingListItem-VolumeCreator");
            }
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            return this._sectionService.listAvailableDisks().then(function(availableDisks) {
                self.availableDisks = availableDisks; 
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (isFirstTime) {
                this.addPathChangeListener("topologySelectedDisk", this, "_handleSelectedDiskChange");
                this.addPathChangeListener("availableSelectedDisk", this, "_handleSelectedDiskChange");
            }
            this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this);
            if (this._parentCascadingListItem) {
                this._parentCascadingListItem.classList.add("CascadingListItem-VolumeCreator");
            }
        }
    },

    _handleSelectedDiskChange: {
        value: function(value) {
            if (this.topologySelectedDisk && this.topologySelectedDisk === value) {
                this.selectedObject = this.topologySelectedDisk._disk;
                this.availableSelectedDisk = null;
            } else if (this.availableSelectedDisk && this.availableSelectedDisk === value) {
                this.selectedObject = this.availableSelectedDisk;
                this.topologySelectedDisk = null;
            } else if (!this.topologySelectedDisk && !this.availableSelectedDisk) {
                this.selectedObject = null;
            }
        } 
    },

    _initializeTopology: {
        value: function (object) {
            object = object || this._object;
            var self = this;
            this._sectionService.clearReservedDisks();
            return this.application.dataService.getNewInstanceForType(Model.ZfsTopology).then(function(topology) {
                object.topology = topology;
                object.topology.cache = [];
                object.topology.data = [];
                object.topology.log = [];
                object.topology.spare = [];

                if (self.disks) {
                    self.disks.map(function(x) {
                        if (x.volume == '/TEMP/') {
                            x.volume = null;
                        }
                    });
                }
                return object;
            })
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
                j, disksLength, disk, path;
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
                        vdev.children[j].type = 'disk';
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

    revert: {
        value: function() {
            this.topologizer.reset();
            this._initializeTopology();
        }
    },

    shouldScrollViewComputeBoundaries: {
        value: function () {
            return !this.topologizer._isMoving;
        }
    },

    save: {
        value: function() {
            var self = this;
            this._cleanupVdevs(this.object.topology.data);
            this._cleanupVdevs(this.object.topology.cache);
            this._cleanupVdevs(this.object.topology.log);
            this._cleanupVdevs(this.object.topology.spare);
            this.object.type = 'zfs';
            this.object._isNew = true;
            this.object.__isLocked = true;
            return this.application.dataService.saveDataObject(this.object).then(function() {
                self.object.__isLocked = false;
            });
        }
    }

});
