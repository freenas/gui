var Montage = require("montage/core/core").Montage,
    Target = require("montage/core/target").Target,
    EventTypes = require("../model/events.mjson"),
    HandlerPool = require("./handler-pool").HandlerPool,
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
            this._listenersOnModelTypeChangesMap = new Map();
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


    /*------------------------------------------------------------------------------------------------------------------
                                                    Properties
    ------------------------------------------------------------------------------------------------------------------*/


    /**
     * @type {Array}
     * @private
     *
     * @description todo.
     *
     */
    _notifications: {
        value: null
    },


    /**
     * @type {Array}
     * @public
     *
     * @description todo.
     *
     */
    notifications: {
        get: function () {
            return this._notifications;
        }
    },


    /**
     * @type {Boolean}
     * @public
     *
     * @description todo.
     *
     */
    isListeningToTaskEvents: {
        get: function () {
            return this.isListeningToChangesOnModel(Model.Task);
        }
    },


    /**
     * @type {Boolean}
     * @public
     *
     * @description todo.
     *
     */
    isListeningToChangesOnModel: {
        value: function (modelType) {
            return this._listenersOnModelTypeChangesMap.has(modelType.typeName || modelType);
        }
    },


    /**
     * @type {Object.<BackEndBridge>}
     * @private
     *
     * @description todo.
     *
     */
    _backendBridge: {
        value: null
    },


    /**
     * @type {Map}
     * @private
     *
     * @description todo.
     *
     */
    _trackingTasksMap: {
        value: null
    },


    /**
     * @type {Map}
     * @private
     *
     * @description todo.
     *
     */
    _listenersOnModelTypeChangesMap: {
        value: null
    },


    /*------------------------------------------------------------------------------------------------------------------
                                                    Public Functions
    ------------------------------------------------------------------------------------------------------------------*/


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    startListenToTaskEvents: {
        value: function () {
            var self = this;

            return this.startListenToChangesOnModelTypeIfNeeded(Model.Task).then(function () {
                return self._backendBridge.subscribeToEvent("task.progress", self);
            });
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
            var self = this;

            return this.stopListenToChangesOnModelType(Model.Task).then(function () {
                return self._backendBridge.unSubscribeToEvent("task.progress", self);
            });
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    startListenToAlertEvents: {
        value: function () {
            var self = this;

            return this.startListenToChangesOnModelTypeIfNeeded(Model.Alert);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    stopListenToAlertEvents: {
        value: function () {
            var self = this;

            return this.stopListenToChangesOnModelType(Model.Alert);
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    startListenToChangesOnModelTypeIfNeeded: {
        value: function (modelType) {
            var modelTypeName = modelType.typeName || modelType,
                eventType = EventTypes[modelTypeName];

            if (eventType && !this._listenersOnModelTypeChangesMap.get(modelTypeName)) {
                var handlerEventTypeName = "handle" + eventType.toCamelCase(),
                    self = this;

                return this._backendBridge.subscribeToEvent(eventType, this).then(function () {
                    if (modelType !== Model.Task && modelType !== Model.Alert && !self[handlerEventTypeName]) {
                        self[handlerEventTypeName] = self.handleEntityChanged;
                    }

                    self._listenersOnModelTypeChangesMap.set(modelTypeName, true);
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
    stopListenToChangesOnModelType: {
        value: function (modelType) {
            var modelTypeName = modelType.typeName || modelType,
                eventType = EventTypes[modelTypeName];

            if (eventType && this._listenersOnModelTypeChangesMap.get(modelTypeName)) {
                var self = this;

                return this._backendBridge.unSubscribeToEvent(eventType, this).then(function () {
                    self._listenersOnModelTypeChangesMap.set(modelTypeName, false);
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
    handleTaskProgress: {
        value: function (event) {
            var detail = event.detail;

            if (detail) {
                var notification = this.findTaskWithJobId(detail.id);

                if (notification) {
                    notification.progress = detail.percentage;
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
    handleEntityChanged: {
        value: function (event) {
            var detail = event.detail;

            if (detail) {
                var notification = this._createNotificationWithType(Notification.TYPES.EVENT);
                notification.modelType = detail.service.toCamelCase();
                notification.service = detail.operation;
                notification.data = detail.operation === "delete" ?  detail.ids :
                    detail.operation === "rename" ? detail.ids[0] : detail.entities;

                // client side time choosen for cosmetic purpose.
                notification.startedTime = Date.now();

                if (typeof notification.data == 'undefined' && detail.data) {
                    notification.data = detail.data.length ? detail.data : [detail.data];
                }

                this.dispatchEventNamed("modelChange", true, true, notification);
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
    handleEntitySubscriberAlertChanged: {
        value: function (event) {
            var detail = event.detail;

            if (detail && detail.entities) {
                var operation = detail.operation;
                if (operation == 'create') {
                    this.addAlert(detail.entities[0]);
                } else if (operation == 'update') {
                    var notification;
                    for (var i = this._notifications.length-1; i >= 0; i--) {
                        notification = this._notifications[i];
                        if (notification.type === 'ALERT' && detail.ids.indexOf(notification.data.id) != -1) {
                            this._notifications.splice(i, 1);
                        }
                    }
                }
            }
        }
    },

    addAlert: {
        value: function(alertEntity) {
            var notification = this._createAlertNotification(alertEntity);
            this._notifications.unshift(notification);
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
                    taskNotification, taskReport, jobId;

                for (var i = 0, length = taskReports.length; i < length; i++) {
                    taskReport = taskReports[i];
                    jobId = taskReport.id;
                    taskNotification = this.findTaskWithJobId(jobId);

                    // notification from outside try to create a notification event
                    if (!taskNotification) {
                        taskNotification = this._startTrackingTaskWithJobId(taskReport, jobId);
                    }

                    if (taskNotification) {
                        var state = taskNotification.state = taskReport.state,
                            isTaskDone = state === Notification.TASK_STATES.FINISHED ||
                                state === Notification.TASK_STATES.FAILED ||
                                state === Notification.TASK_STATES.ABORTED;

                        taskNotification.taskReport = taskReport;

                        if (isTaskDone) {
                            if (taskReport.progress) {
                                taskNotification.progress = taskReport.progress.percentage;
                            }

                            if (state === Notification.TASK_STATES.FAILED) {
                                var errorMessage;

                                if (taskReport.error) {
                                    var error = taskReport.error,
                                        information,
                                        ll, ii,
                                        extra;

                                    errorMessage = error.message;

                                    if ((extra = error.extra)) {
                                        for (ii = 0, ll = extra.length; ii < ll; ii++) {
                                            information = extra[ii];
                                            errorMessage += "\n" + (
                                                    information.path && information.path.length === 2 ?
                                                    information.path[1] + ": " : ""
                                                ) + information.message;
                                        }
                                    }
                                } else {
                                    //fixme: need a better fallback message
                                    errorMessage = "task failed";
                                }

                                taskNotification.errorMessage = errorMessage;
                            }

                            this._stopTrackingTaskWithJobId(jobId);
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
    removeNotification: {
        value: function (notification) {
            if (notification) {
                var canDeleteNotification = false,
                    notifications = this._notifications,
                    notificationIndex = notifications.indexOf(notification);

                if ((canDeleteNotification = notificationIndex > -1)) {
                    if (notification.type === Notification.TYPES.TASK) { // if notification is a task
                        // if notification is a task that is not in a "finished" state. (FINISHED, ABORTED, FAILED)
                        canDeleteNotification = !this._trackingTasksMap.has(notification.jobId);
                    }
                }

                if (canDeleteNotification) {
                    notifications.splice(notifications.indexOf(notification), 1);
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
    _stopTrackingTaskWithJobId: {
        value: function (jobId) {
            var tasksMap = this._trackingTasksMap;

            if (tasksMap.has(jobId)) {
                tasksMap.delete(jobId);
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


    /*------------------------------------------------------------------------------------------------------------------
                                                   Private Functions
    ------------------------------------------------------------------------------------------------------------------*/


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _addNotification: {
        value:function (notification) {
            this.notifications.unshift(notification);
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _startTrackingTaskWithJobId: {
        value:function (task, jobId) {
            var tasksMap = this._trackingTasksMap,
                notification;

            if (!tasksMap.get(jobId)) {
                notification = this._createTaskNotification(jobId, task.name || task, task.created_at);
                tasksMap.set(jobId, notification);
                this._addNotification(notification);
            } else {
                throw new Error(
                    "NotificationCenter is already following the notification with the jobId: '" + jobId  + "'"
                );
            }

            return notification;
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _createAlertNotification: {
        value: function (alertEntity) {
            var notification = this._createNotificationWithType(Notification.TYPES.ALERT);
            notification.jobId = alertEntity.id;
            notification.taskName = alertEntity.title;
            notification.data = alertEntity;
            notification.startedTime = Date.parse(alertEntity.created_date) || Date.now();

            return notification;
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _createTaskNotification: {
        value:function (jobId, taskName, startedTime) {
            var notification = this._createNotificationWithType(Notification.TYPES.TASK);
            notification.jobId = jobId;
            notification.taskName = taskName;
            notification.startedTime = Date.parse(startedTime) || Date.now();

            return notification;
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _createNotificationWithType: {
        value:function (type) {
            return new Notification(type);
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

    service: {
        value: null
    },

    data: {
        value: null
    },

    startedTime: {
        value: null
    },

    taskName: {
        value: null
    },

    progress: {
        value: 0
    },

    errorMessage: {
        value: null
    },

    taskReport: {
        value: null
    }

}, {


    TYPES: {
        value: {
            TASK: "TASK",
            EVENT: "EVENT",
            ALERT: "ALERT"
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
