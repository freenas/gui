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
            return this._populateComponentIfNeeded();
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;
            this.super(isFirstTime);
            this._sectionService.listBootEnvironments().then(function(bootEnvironments) {
                self._handleBootEnvironmentChange(bootEnvironments);
                self.bootEnvironmentListener = self._eventDispatcherService.addEventListener(ModelEventName.BootEnvironment.contentChange, self._handleBootEnvironmentChange.bind(self));
            });
            this._subscribeToEventListeners();

            this._populateComponentIfNeeded();
        }
    },

    exitDocument: {
       value: function() {
          this._eventDispatcherService.removeEventListener('AvailableDisksChanged', this.availableDisksListener);
          this._eventDispatcherService.removeEventListener('BootDisksChanged', this.bootDisksListener);
          this._eventDispatcherService.removeEventListener(ModelEventName.BootEnvironment.contentChange, this.bootEnvironmentListener);
          this.bootVolume = null;
       }
    },

    bootVolume: {
        value: null
    },

    _populatingPromise: {
        value: null
    },

    _handleBootEnvironmentChange: {
        value: function(state) {
            this._dataObjectChangeService.handleContentChange(this.bootEnvironments, state);
        }
    },

    _subscribeToEventListeners: {
        value: function() {
            var self = this;

            this.availableDisksListener = this._eventDispatcherService.addEventListener('AvailableDisksChanged', function(data) {
                self._extractAvailableDisks(data.valueSeq().toJS());
            });
            this.bootDisksListener = this._eventDispatcherService.addEventListener('BootDisksChanged', function(data) {
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
            var self = this;
            if (!this._populatingPromise && (!this.bootEnvironments || !this.bootVolume)) {
                return this._populatingPromise = Promise.all([
                    this._sectionService.getBootVolumeConfig(),
                    this._sectionService.listDisks()
                ]).spread(function(bootVolume) {
                    self.bootVolume = bootVolume;
                    self._bootDisks = self._sectionService.listBootDisks();
                    self._extractAvailableDisks(self._sectionService.listAvailableDisks());
                    return self._populatingPromise = null;
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
            var self = this;
            this._isLocked = true;
            return this._sectionService.scrubBootPool().then(function(submittedTask) {
                return submittedTask.taskPromise;
            }).finally(function() {
                self._isLocked = false;
            });
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
