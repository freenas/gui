/**
 * @module ui/boot-pool.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Bindings = require("montage/core/core").Bindings,
    Promise = require("montage/core/promise").Promise,
    NotificationCenterModule = require("core/backend/notification-center");

/**
 * @class BootPool
 * @extends Component
 */
exports.BootPool = AbstractInspector.specialize(/** @lends BootPool# */ {

    _scrubTaskId: {
        value: 0
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this._bootEnvironmentService = this.application.bootEnvironmentService;
                this._notificationCenter = NotificationCenterModule.defaultNotificationCenter;

/*
                this._notificationCenter.startListenToChangesOnModelTypeIfNeeded("BootPool").then(function() {
                    self._notificationCenter.addEventListener('modelChange', self);
                });
*/
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

    _populateComponentIfNeeded: {
        value: function () {
            if (!this._populatingPromise && (!this.bootEnvironments || !this.bootVolume)) {
                this._populatingPromise = Promise.all([
                        this._bootEnvironmentService.list(),
                        this._bootEnvironmentService.getBootVolumeConfig()
                ]).bind(this).then(function (data) {
                    this.bootEnvironments = data[0];
                    this.bootVolume = data[1];
                    this._populatingPromise = null;
                });
            }
        }
    },

    handleScrubAction: {
        value: function() {
            var self = this;

            this._bootEnvironmentService.scrubBootPool().then(function(taskId) {
                if (taskId) {
                    self._scrubTaskId = taskId;
                    self._notificationCenter.addEventListener("taskDone", self);
                }
            });
        }
    },

    handleTaskDone: {
        value: function(event) {
            var taskId = event.detail.jobId;
            if (this._scrubTaskId === event.detail.jobId) {
                this._scrubTaskId = 0;
                this._notificationCenter.removeEventListener("taskDone", self);
            }
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
    }

});
