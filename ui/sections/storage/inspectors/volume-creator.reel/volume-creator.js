var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
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


    _inspectorTemplateDidLoad: {
        value: function() {
            // var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (isFirstTime) {
                this.addPathChangeListener("topologySelectedDisk", this, "_handleSelectedDiskChange");
                this.addPathChangeListener("availableSelectedDisk", this, "_handleSelectedDiskChange");
            }
            this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this);
            if (this._parentCascadingListItem) {
                this._parentCascadingListItem.classList.add("CascadingListItem-VolumeCreator");
            }
            this.availableDisks = this._sectionService.listAvailableDisks();
            this._eventDispatcherService.addEventListener('availableDisksChange', this._handleAvailableDisksChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this._eventDispatcherService.removeEventListener('availableDisksChange', this._handleAvailableDisksChange.bind(this));
            if (this._parentCascadingListItem) {
                this._parentCascadingListItem.classList.remove("CascadingListItem-VolumeCreator");
            }
        }
    },

    _handleAvailableDisksChange: {
        value: function(availableDisks) {
            this.availableDisks = availableDisks;
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
            this.object.__isLocked = true;
            return this._sectionService.createVolume(this.object).then(function() {
                self.object.__isLocked = false;
            });
        }
    }

});
