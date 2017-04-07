var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require("lodash");

exports.CalendarTask = AbstractInspector.specialize({
    _daysOfMonth: {
        value: null
    },

    daysOfMonth: {
        get: function () {
            if(!this._daysOfMonth) {
                this._daysOfMonth = [];
                for (var i = 1; i <= 31; i++) {
                    this._daysOfMonth.push({"value": i, "label": i, "index": (i - 1)});
                }
            }
            return this._daysOfMonth;
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.scheduleOptions = _.values(this._sectionService.SCHEDULE_OPTIONS);
            this.daysOfWeek = this._sectionService.DAYS_OF_WEEK;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            this.object._customSchedule = {_objectType: 'CalendarCustomSchedule'};
            this._sectionService.initializeCalendarTask(this.object, this.context.parentContext.object.view);
            this.addRangeAtPathChangeListener("object._simpleSchedule.type", this, "_handleScheduleTypeChange");
            this.addRangeAtPathChangeListener("object._simpleSchedule.type", this, "_handleSimpleScheduleChange");
            this.addRangeAtPathChangeListener("object._simpleSchedule.time", this, "_handleSimpleScheduleChange");
            this.addRangeAtPathChangeListener("object._simpleSchedule.daysOfMonth", this, "_handleSimpleScheduleChange");
            this.addRangeAtPathChangeListener("object._simpleSchedule.daysOfWeek", this, "_handleSimpleScheduleChange");
            if (this.object.task) {
                this.classList.add('type-' + this.object.task.replace('.', '_').toLowerCase());
                if (this.object._replicationObject ) {
                    this.replicationObject = this.object._replicationObject;
                    this.extraDeleteFlags = [{
                        "label": "Delete associated replication?",
                        "value": "delete_repl",
                        "checked": false
                    }];
                    this.extraDeleteMessage = "I am sure that I wish to delete this calendar task and its associated replication";
                } else {
                    this.replicationObject = null;
                    this.extraDeleteFlags = [];
                    this.extraDeleteMessage = null;
                }
            }
        }
    },

    exitDocument: {
        value: function() {
            this.super();

            if (this.getPathChangeDescriptor("object._simpleSchedule.type", this)) {
                this.removePathChangeListener("object._simpleSchedule.type", this);
            }
            if (typeof this._cancelDaysOfWeekListener === "function") {
                this._cancelDaysOfWeekListener();
                this._cancelDaysOfWeekListener = null;
            }
            if (typeof this._cancelDaysOfMonthListener === "function") {
                this._cancelDaysOfMonthListener();
                this._cancelDaysOfMonthListener = null;
            }

            if (this.object.task) {
                this.classList.remove('type-' + this.object.task.replace('.', '_').toLowerCase());
            }
        }
    },

    resolveArgs: {
        value: function(args) {
            var argsLength = args.length;
            args = args.filter(function(x) {
                return !!x || (typeof x !== "undefined" && typeof x !== "object") ;
            });
            args.length = argsLength;
            return Promise.resolve(args);
        }
    },

    save: {
        value: function() {
            this._sectionService.updateScheduleOnTask(this.object);
            delete this.object.status;

            var self = this;
            return this._saveCalendarTaskArgs().then(function () {
                return self.inspector.save();
            });
        }
    },

    delete: {
        value: function(object) {
            if (this.replicationObject && this.extraDeleteFlags[0].checked) {
                this._sectionService.deleteReplication(this.replicationObject);
            }
            this.inspector.delete();
        }
    },

    handleRunNowAction: {
        value: function () {
            var self = this;

            return this._saveCalendarTaskArgs().then(function () {
                return self._sectionService.runTask(self.object);
            });
        }
    },

    _handleScheduleTypeChange: {
        value: function() {
            if (!this.object._simpleSchedule || this.object._simpleSchedule.type !== this._sectionService.SCHEDULE_OPTIONS.CUSTOM.value) {
                this.context.cascadingListItem.selectedObject = null;
            } else {
                this.context.cascadingListItem.selectedObject = this.object._customSchedule;
            }
        }
    },

    _saveCalendarTaskArgs: {
        value: function () {
            var args = this._prepareCalendarTaskArgs(),
                self = this;
            
            if (this.argsInspector && typeof this.argsInspector.save === 'function') {
                args = this.argsInspector.save(this.object);
            }

            return (Promise.is(args) ? args : Promise.resolve(args)).then(function (args) {
                self.object.args = args;
            });
        }
    },

    _prepareCalendarTaskArgs: {
        value: function () {
            var args = this.object.args;

            if (this.taskToInspector[this.object.task] === 'cron') {
                args[0] = this.context.cronUser.username;
            } else if (this.taskToInspector[this.object.task] === 'rsync' && args[0]) {
                args[0].user = this.context.rsyncUser.username;
            }

            return args;
        }
    },

    _handleSimpleScheduleChange: {
        value: function() {
            this.scheduleString = this._sectionService.getScheduleStringForTask(this.object);
        }
    }

}, {
    _CAN_DRAW_FIELD: {
        value: 'isServiceLoaded'
    }
});
