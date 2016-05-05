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
            return this._listenersOnModelChangesMap.has(modelType.typeName || modelType);
        }
    },


    /**
     * @type {number}
     * @private
     *
     * @description todo.
     *
     */
    _dismissNotificationAfterDelay: {
        value: 2000
    },


    /**
     * @type {number}
     * @public
     *
     * @description todo.
     *
     */
    dismissNotificationAfterDelay: {
        set: function (dismissNotificationAfterDelay) {
            dismissNotificationAfterDelay = ~~dismissNotificationAfterDelay;

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


    /**
     * @type {Boolean}
     * @private
     *
     * @description todo.
     *
     */
    _dismissNotificationDelay: {
        value: null
    },


    /**
     * @type {Boolean}
     * @public
     *
     * @description todo.
     *
     */
    dismissNotificationDelay: {
        set: function (dismissNotificationAfterDelay) {
            this._dismissNotificationDelay = !!dismissNotificationAfterDelay;
        },
        get: function () {
            return this._dismissNotificationDelay;
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
    _listenersOnModelChangesMap: {
        value: null
    },


    /**
     * @type {Object.<HandlerPool>}
     * @private
     *
     * @description todo.
     *
     */
    __taskHandlerPool: {
        value: null
    },


    /**
     * @type {HandlerPool}
     * @private
     *
     * @description todo.
     *
     */
    _taskHandlerPool: {
        get: function () {
            return this.__taskHandlerPool || (this.__taskHandlerPool = new HandlerPool());
        }
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

            return this.startListenToChangesOnModelIfNeeded(Model.Task).then(function () {
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

            return this.stopListenToChangesOnModel(Model.Task).then(function () {
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

                return this._backendBridge.unSubscribeToEvent(eventType, this).then(function () {
                    self._listenersOnModelChangesMap.set(modelTypeName, false);
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
                notification.data = detail.operation === "delete" ? detail.ids : detail.entities;
                notification.startedTime = Date.now(); //todo need verification

                this.dispatchEventNamed("modelChange", true, true, notification);
                this._addNotification(notification);
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

                            this.handleTaskDone(jobId, taskReport);

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
    handleTaskDone: {
        value: function (jobId, taskReport) {
            var taskHandler = this._taskHandlerPool.releaseHandler(jobId);

            if (taskHandler) {
                if (taskReport.state === Notification.TASK_STATES.FINISHED) {
                    taskHandler.resolve();
                } else {
                    taskHandler.reject(taskReport);
                }

                this._trackingTasksMap.delete(jobId);
            } else {
                //todo: throw an error/warning ?
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
    startTrackingTaskWithJobIdAndModel: {
        value: function (task, jobId, model) {
            var self = this;

            return new Promise(function (resolve, reject) {
                self._taskHandlerPool.addHandler({
                    resolve: resolve,
                    reject: reject
                }, jobId);

                self._startTrackingTaskWithJobIdAndModel(task, jobId, model);
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
    stopTrackingTaskWithJobId: {
        value: function (jobId) {
            var taskHandler = this._taskHandlerPool.releaseHandler(jobId),
                tasksMap = this._trackingTasksMap;

            if (taskHandler) {
                taskHandler.reject(new Error("stop tracking task with jobId: " + jobId));
            }

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
            this._notifications.unshift(notification);
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _startTrackingTaskWithJobIdAndModel: {
        value:function (task, jobId, model) {
            var tasksMap = this._trackingTasksMap;

            if (!tasksMap.get(jobId)) {
                var notification = this._createTaskNotification(jobId, task.name || task, task.created_at);
                tasksMap.set(jobId, notification);
                notification.data = [model];
                notification.modelType = Object.getPrototypeOf(model).Type

                this._addNotification(notification);

            } else {
                throw new Error(
                    "NotificationCenter is already following the notification with the jobId: '" + jobId  + "'"
                );
            }
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
