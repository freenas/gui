var Montage = require("montage/core/core").Montage,
    Map = require("collections/map");


var NotificationCenter = exports.NotificationCenter = Montage.specialize({


    constructor: {
        value: function NotificationCenter () {
            this._notifications = [];
            this._tasksMap = new Map();
        }
    },


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


    _tasksMap: {
        value: false
    },


    isListeningToTaskEvents: {
        value: false
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
            if (!this.isListeningToTaskEvents) {
                this._backendBridge.subscribeToEvent("entity-subscriber.task.changed", this);
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
    stopListenToTaskEvents: {
        value: function () {
            if (this.isListeningToTaskEvents) {
                this._backendBridge.unSubscribeToEvent("entity-subscriber.task.changed", this);
            }
        }
    },


    handleEntitySubscriberNetworkInterfaceChanged: {
        value: function (event) {
            console.log(event)
            //todo:
            // 1: ask for the job id that initiated this change.
            // 2: make a events.mjson file that knows how to map event from entity
            // 3: make generic that method -> handleEntityChange.
            // 4: listen lazily task subscription (need map) (should unsubscribe when logged out)
        }
    },


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
                        var state = taskNotification.state = taskReport.state;

                        if (state === Notification.TASK_STATES.FINISHED) {
                            //Fixme: pass the correct value ?
                            //Need jobId fix
                            taskNotification._deferred.resolve();

                        } else if (state === Notification.TASK_STATES.FAILED || state === Notification.TASK_STATES.ABORTED) {
                            taskNotification._deferred.reject(event.detail);
                        }

                        if (this.dismissNotificationAfterDelay && (state === Notification.TASK_STATES.FINISHED ||
                            state === Notification.TASK_STATES.FAILED || state === Notification.TASK_STATES.ABORTED)) {

                            this._stopTrackingTaskAfterDelay(taskNotification, this.dismissNotificationDelay);
                        }
                    }
                }
            }
        }
    },


    createNotificationWithType: {
        value:function (type) {
            return new Notification(type);
        }
    },


    startTrackingTask: {
        value: function (jobId, model, deferred) {
            var tasksMap = this._tasksMap;

            if (!tasksMap.get(jobId)) {
                var notification = this.createNotificationWithType(Notification.TYPES.TASK);
                notification.jobId = jobId;
                notification.relatedModel = model;
                notification._deferred = deferred;

                tasksMap.set(jobId, notification);
                this._notifications.push(notification);
            } else {
                throw new Error(
                    "NotificationCenter is already following the notification with the jobId: '" + jobId  + "'"
                );
            }
        }
    },


    stopTrackingTaskWithJobId: {
        value: function (jobId) {
            var tasksMap = this._tasksMap;

            if (tasksMap.has(jobId)) {
                var notifications = this._notifications,
                    notification = tasksMap.get(jobId);

                tasksMap.delete(jobId);
                notifications.splice(notifications.indexOf(notification), 1);
            }
        }
    },


    findTaskWithJobId: {
        value: function (jobId) {
            return this._tasksMap.get(jobId) || null;
        }
    },


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


    relatedModel: {
        value: null
    },


    _handler: {
        value: null
    }


}, {


    TYPES: {
        value: {
            //todo: add more
            TASK: "TASK"
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
