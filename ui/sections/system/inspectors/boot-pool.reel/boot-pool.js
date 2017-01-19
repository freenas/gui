var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    Promise = require("montage/core/promise").Promise,
    _ = require('lodash');
    
exports.BootPool = AbstractInspector.specialize(/** @lends BootPool# */ {

    _blockingTaskId: {
        value: 0
    },

    enterDocument: {
        value: function (isFirstTime) {

            if (isFirstTime) {
                this._bootEnvironmentService = this.application.bootEnvironmentService;
                this._systemService = this.application.systemService;
                this._eventDispatcherService = EventDispatcherService.getInstance();
                this._subscribeToDiskAllocationUpdates();
            }

            this._populateComponentIfNeeded();
        }
    },

    bootEnvironments: {
        value: null
    },

    bootVolume: {
        value: null
    },

    _populatingPromise: {
        value: null
    },

    _subscribeToDiskAllocationUpdates: {
        value: function() {
            var self = this;

            this._eventDispatcherService.addEventListener('AvailableDisksChanged', function(data) {
                self._extractAvailableDisks(data.valueSeq().toJS());
            });
            this._eventDispatcherService.addEventListener('BootDisksChanged', function(data) {
                self._bootDisks = data.valueSeq().toJS();
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

    _populateComponentIfNeeded: {
        value: function () {
            if (!this._populatingPromise && (!this.bootEnvironments || !this.bootVolume)) {
                this._populatingPromise = Promise.all([
                    this._sectionService.listBootEnvironments(),
                    this._sectionService.getBootVolumeConfig(),
                    this._sectionService.listDisks()
                ]).bind(this).then(function (data) {
                    this.bootEnvironments = data[0];
                    this.bootVolume = data[1];
                    this._bootDisks = this._sectionService.listBootDisks();
                    this._extractAvailableDisks(this._sectionService.listAvailableDisks());
                    this._populatingPromise = null;
                });
            }
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
            return this._bootEnvironmentService.scrubBootPool()
                .then(this._blockUiTillTaskCompletion.bind(this));
        }
    },

    handleModelChange: {
        value: function(event) {
            var detail = event.detail,
                data = detail.data,
                modelType = detail.modelType;

            if (modelType === 'BootPool') {
                this.bootVolume = data[0];
            }
        }
    },

    didRequestAddDisk: {
        value: function(newDisk, oldDisk) {
            return this._systemService.addDiskToBootPool(newDisk, oldDisk)
                .then(this._blockUiTillTaskCompletion.bind(this));
        }
    }

});
