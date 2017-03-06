var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
    _ = require('lodash');

exports.BootPool = AbstractInspector.specialize({
    bootEnvironments: {
        value: []
    },

    _blockingTaskId: {
        value: 0
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this._systemService = this.application.systemService;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dataObjectChangeService = new DataObjectChangeService();
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super(isFirstTime);

            this._refreshData();
            this._subscribeToModelChanges();
        }
    },

    exitDocument: {
       value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.BootEnvironment.contentChange, this.bootEnvironmentListener);
            this._eventDispatcherService.removeEventListener(ModelEventName.BootPool.contentChange, this.bootPoolListener);
            this._eventDispatcherService.removeEventListener('BootDisksChanged', this.bootDisksListener);
            this._eventDispatcherService.removeEventListener('AvailableDisksChanged', this.availableDisksListener);
       }
    },

    _handleAvailableDisksChange: {
        value: function(state) {
            this._availableDisks = state.valueSeq().toJS();
        }
    },

    _handleBootDisksChange: {
        value: function(state) {
            this._extractAvailableDisks(state.valueSeq().toJS());
        }
    },

    _handleBootPoolChange: {
        value: function(state) {
            this.bootVolume = state;
        }
    },

    _handleBootEnvironmentChange: {
        value: function(state) {
            this._dataObjectChangeService.handleContentChange(this.bootEnvironments, state);
        }
    },

    _subscribeToModelChanges: {
        value: function() {
            this.bootEnvironmentListener = this._eventDispatcherService.addEventListener(ModelEventName.BootEnvironment.contentChange, this._handleBootEnvironmentChange.bind(this));
            this.bootVolumeListener = this._eventDispatcherService.addEventListener(ModelEventName.BootPool.contentChange, this._handleBootPoolChange.bind(this));
            this.bootDisksListener = this._eventDispatcherService.addEventListener('BootDisksChanged', this._handleBootDisksChange.bind(this));
            this.availableDisksListener = this._eventDispatcherService.addEventListener('AvailableDisksChanged', this._handleAvailableDisksChange.bind(this));
        }
    },

    _refreshData: {
        value: function() {
            var self = this;

            return Promise.all([
                this._sectionService.listBootEnvironments(),
                this._sectionService.getBootVolumeConfig(),
                this._sectionService.listDisks()
            ]).spread(function(bootEnvironments, bootVolume, disks) {
                var bootDiskIds = _.map(bootVolume.disks, 'disk_id');
                self._bootDisks = _.filter(disks, function(disk) {
                    return bootDiskIds.indexOf(disk.id) > -1;
                });
                self._handleBootEnvironmentChange(bootEnvironments);
                self.bootVolume = bootVolume;
                self._extractAvailableDisks(self._sectionService.listAvailableDisks());
            });
        }
    },

    _extractAvailableDisks: {
        value: function(disks) {
            var self = this;

            this._availableDisks = _(disks)
                .filter(function(disk) {
                    return disk.mediasize >= (self.bootVolume ? self.bootVolume.properties.size.rawvalue : 0);
                })
                .sortBy('name')
                .value();
        }
    },

    _blockUiTillTaskCompletion: {
        value: function(task) {
            var self = this;

            if (task) {
                this._blockingTaskId = task.taskId;
                task.taskPromise.then(function() {
                    self._blockingTaskId = 0;
                });
            }
        }
    },

    handleScrubAction: {
        value: function() {
            var self = this;
            this._isLocked = true;
            return this._sectionService.scrubBootPool().then(function(submittedTask) {
                return submittedTask.taskPromise;
            }).finally(function() {
                self._isLocked = false;
            });
        }
    },

    didRequestAddDisk: {
        value: function(newDisk, oldDisk) {
            return this._systemService.addDiskToBootPool(newDisk, oldDisk)
                .then(this._blockUiTillTaskCompletion.bind(this));
        }
    }

});
