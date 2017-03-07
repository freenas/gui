var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    RoutingService = require("core/service/routing-service").RoutingService,
    _ = require("lodash");

var Topology = exports.Topology = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this._routingService = RoutingService.getInstance();
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
            var self = this;
            this._sectionService.clearReservedDisks();
            this._sectionService.listAvailableDisks().then(function(availableDisks) {
                self.availableDisks = availableDisks;
            });
            this.topologyProxy = this._sectionService.getTopologyProxy(this.object);
            this.context.cascadingListItem.classList.add("CascadingListItem-Topology");
            this.availableDisksEventListener = this._eventDispatcherService.addEventListener('AvailableDisksChanged', this._handleAvailableDisksChange.bind(this));
            this.topologyChangedListener = this._eventDispatcherService.addEventListener('VolumeTopologyChanged-' + this.object._volume.id, this.handleTopologyChanged.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener('availableDisksChange', this.availableDisksEventListener);
            this._eventDispatcherService.removeEventListener('VolumeTopologyChanged-' + this.object._volume.id, this.topologyChangedListener);
            this._sectionService.clearReservedDisks();
            this.context.cascadingListItem.classList.remove("CascadingListItem-Topology");
        }
    },

    save: {
        value: function() {
            return this._sectionService.updateVolumeTopology(this.object._volume, this.topologyProxy);
        }
    },

    revert: {
        value: function() {
            this._sectionService.clearReservedDisks();
            this.topologyProxy = this._sectionService.getTopologyProxy(this.object);
        }
    },

    handleTopologyChanged: {
        value: function(state) {
            if (state) {
                _.forEach(this.topologyProxy, function(vdevs, section) {
                    _.forEach(vdevs, function(vdev, vdevIndex) {
                        var stateVdev = state.get(section).get(vdevIndex);
                        if (vdev.status) {
                            vdev.status = stateVdev.get('status');
                        }
                        if (vdev.children) {
                            _.forEach(vdev.children, function(child, childIndex) {
                                if (child.status) {
                                    child.status = stateVdev.get('children').get(childIndex).get('status');
                                }
                            });
                        }
                    });
                });
            }
        }
    },

    _handleAvailableDisksChange: {
        value: function(availableDisks) {
            this.availableDisks = availableDisks.valueSeq().toJS();
        }
    },

    _handleSelectedDiskChange: {
        value: function(value) {
            if (value && value.status !== 'REMOVED') {
                var diskId = value._disk ? value._disk.id : value.id;
                this._routingService.navigate(this.context.path + '/disk/_/' + diskId);
            }
        }
    }
});
