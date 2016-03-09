var Montage = require("montage/core/core").Montage,
    Target = require("montage/core/target").Target,
    EventTypes = require("../model/events.mjson"),
    Model = require("../model/model").Model,
    Map = require("collections/map");


var NotificationCenter = exports.NotificationCenter = Target.specialize({


    /**
     * @constructor
     * @public
     *
     * @description todo
     *
     */
    constructor: {
        value: function NotificationCenter () {
            this._notifications = [];
            this._trackingTasksMap = new Map();
            this._listenersOnModelChangesMap = new Map();
        }
    },


    /**
     * @public
     * @function
     *
     * @description todo
     *
     */
    initWithBackendBridge: {
        value: function (backendBridge) {
            this._backendBridge = backendBridge;

            return this;
        }
    },


    _backendBridge: {
        value: null
    },


    _notifications: {
        value: null
    },


    notifications: {
        get: function () {
            return this._notifications;
        }
    },


    _trackingTasksMap: {
        value: null
    },


    _listenersOnModelChangesMap: {
        value: null
    },


    isListeningToTaskEvents: {
        get: function () {
            return this.isListeningToChangesOnModel(Model.Task);
        }
    },


    _dismissNotificationAfterDelay: {
        value: 2000
    },


    dismissNotificationAfterDelay: {
        set: function (dismissNotificationAfterDelay) {
            dismissNotificationAfterDelay = !!dismissNotificationAfterDelay;

            if (this._dismissNotificationAfterDelay !== dismissNotificationAfterDelay) {
                this._dismissNotificationAfterDelay = dismissNotificationAfterDelay;

                if (dismissNotificationAfterDelay) {
                    //todo: should clean all existing notifications?
                }
            }
        },
        get: function () {
            return this._dismissNotificationAfterDelay;
        }
    },


    _dismissNotificationDelay: {
        value: null
    },


    dismissNotificationDelay: {
        set: function (dismissNotificationAfterDelay) {
            this._dismissNotificationDelay = ~~dismissNotificationAfterDelay;
        },
        get: function () {
            return this._dismissNotificationDelay;
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    startListenToTaskEvents: {
        value: function () {
            return this.startListenToChangesOnModelIfNeeded(Model.Task);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    stopListenToTaskEvents: {
        value: function () {
            return this.stopListenToChangesOnModel(Model.Task);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    startListenToChangesOnModelIfNeeded: {
        value: function (modelType) {
            var modelTypeName = modelType.typeName || modelType,
                eventType = EventTypes[modelTypeName];

            if (eventType && !this._listenersOnModelChangesMap.get(modelTypeName)) {
                var handlerEventTypeName = "handle" + eventType.toCamelCase(),
                    self = this;

                return this._backendBridge.subscribeToEvent(eventType, this).then(function () {
                    if (modelType !== Model.Task && !self[handlerEventTypeName]) {
                        self[handlerEventTypeName] = self.handleEntityChanged;
                    }

                    self._listenersOnModelChangesMap.set(modelTypeName, true);
                });
            }

            return Promise.resolve();
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    stopListenToChangesOnModel: {
        value: function (modelType) {
            var modelTypeName = modelType.typeName || modelType,
                eventType = EventTypes[modelTypeName];

            if (eventType && this._listenersOnModelChangesMap.get(modelTypeName)) {
                var self = this;

                return this._backendBridge.subscribeToEvent(eventType, this).then(function () {
                    self._listenersOnModelChangesMap.set(modelTypeName, false);
                });
            }

            return Promise.resolve();
        }
    },

    isListeningToChangesOnModel: {
        value: function (modelType) {
            return this._listenersOnModelChangesMap.has(modelType.typeName || modelType);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    handleEntityChanged: {
        value: function (event) {
            var detail = event.detail;

            if (detail) {
                var notification = this.createNotificationWithType(Notification.TYPES.EVENT);
                notification.modelType = detail.service.toCamelCase();
                notification.service = detail.operation;
                notification.data = detail.operation === "delete" ? detail.ids : detail.entities;


                this.dispatchEventNamed("modelChange", true, true, notification);
                this._notifications.push(notification);
            }
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    handleEntitySubscriberTaskChanged: {
        value: function (event) {
            var detail = event.detail;

            if (detail && detail.entities) {
                // Real "entities" for task events are in entities.args.
                // Entities for task events are a mix between task status and involved entities.
                var taskReports = detail.entities,
                    taskNotification,
                    taskReport,
                    jobId;

                for (var i = 0, length = taskReports.length; i < length; i++) {
                    taskReport = taskReports[i];
                    jobId = taskReport.id;
                    taskNotification = this.findTaskWithJobId(jobId);

                    if (taskNotification) {
                        var state = taskNotification.state = taskReport.state,
                            isTaskDone = state === Notification.TASK_STATES.FINISHED ||
                                state === Notification.TASK_STATES.FAILED ||
                                state === Notification.TASK_STATES.ABORTED;

                        if (isTaskDone) {
                            this.dispatchEventNamed("taskDone", true, true, {
                                jobId: jobId,
                                taskReport: taskReport
                            });

                            if (this.dismissNotificationAfterDelay) {
                                this._stopTrackingTaskAfterDelay(taskNotification, this.dismissNotificationDelay);
                            }
                        }
                    }
                }
            }
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    createNotificationWithType: {
        value:function (type) {
            return new Notification(type);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    startTrackingTaskWithJobId: {
        value: function (jobId) {
            var tasksMap = this._trackingTasksMap;

            if (!tasksMap.get(jobId)) {
                var notification = this.createNotificationWithType(Notification.TYPES.TASK);
                notification.jobId = jobId;
                tasksMap.set(jobId, notification);
                this._notifications.push(notification);
            } else {
                throw new Error(
                    "NotificationCenter is already following the notification with the jobId: '" + jobId  + "'"
                );
            }
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    stopTrackingTaskWithJobId: {
        value: function (jobId) {
            var tasksMap = this._trackingTasksMap;

            if (tasksMap.has(jobId)) {
                var notifications = this._notifications,
                    notification = tasksMap.get(jobId);

                tasksMap.delete(jobId);
                notifications.splice(notifications.indexOf(notification), 1);
            }
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    findTaskWithJobId: {
        value: function (jobId) {
            return this._trackingTasksMap.get(jobId) || null;
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _stopTrackingTaskAfterDelay: {
        value: function (taskNotification, delay) {
            var self = this;

            setTimeout(function () {
                self.stopTrackingTaskWithJobId(taskNotification.jobId);
            }, delay);
        }
    }

});


var _defaultNotificationCenter;


Object.defineProperty(exports, "defaultNotificationCenter", {

    set: function (notificationCenter) {
        _defaultNotificationCenter = notificationCenter;
    },
    get: function () {
        return _defaultNotificationCenter || (_defaultNotificationCenter = new NotificationCenter());
    }

});


var Notification = exports.Notification =  Montage.specialize({


    constructor: {
        value: function Notification (type) {
            this._type = type;
        }
    },


    _type: {
        value: null
    },


    type: {
        get: function () {
            return this._type;
        }
    },


    _state: {
        value: null
    },


    state: {
        set: function (state) {
            if (this._type === Notification.TYPES.TASK && Notification.TASK_STATES[state] && this._state !== state) {
                this._state = state;
            }
        },
        get: function () {
            if (!this._state && this._type === Notification.TYPES.TASK) {
                this._state = Notification.TASK_STATES.CREATED;
            }

            return this._state;
        }
    },


    jobId: {
        value: null
    },


    modelType: {
        value: null
    },


    service: {
        value: null
    },


    data: {
        value: null
    }


}, {


    TYPES: {
        value: {
            TASK: "TASK",
            EVENT: "EVENT"
        }
    },


    //Fixme: should be an enumeration.
    TASK_STATES: {
        value: {
            CREATED: 'CREATED',
            WAITING: 'WAITING',
            EXECUTING: 'EXECUTING',
            FINISHED: 'FINISHED',
            ROLLBACK: 'ROLLBACK',
            FAILED: 'FAILED',
            ABORTED: 'ABORTED'
        }
    }

});
