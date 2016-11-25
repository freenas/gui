var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    CalendarSectionService = require("core/service/section/calendar-section-service").CalendarSectionService,
    Model = require("core/model/model").Model;

exports.CalendarTask = AbstractInspector.specialize({
    _sectionService: {
        value: null
    },

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

    templateDidLoad: {
        value: function() {
            var self = this;
            this._canDrawGate.setField(this.constructor._CAN_DRAW_FIELD, false);
            CalendarSectionService.instance.then(function(sectionService) {
                self._sectionService = sectionService;
                self.scheduleOptions = Object.keys(sectionService.SCHEDULE_OPTIONS).map(function(x) {
                    return sectionService.SCHEDULE_OPTIONS[x];
                });
                self.daysOfWeek = sectionService.DAYS_OF_WEEK;

                self._canDrawGate.setField(self.constructor._CAN_DRAW_FIELD, true);
            });

            this.taskCategories = [{ name: '---', value: null }].concat(this.application.calendarService.taskCategories);
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            var self = this;

            this.application.dataService.getNewInstanceForType(Model.CalendarCustomSchedule).then(function (result) {
                self.object._customSchedule = result;
                self._sectionService.initializeCalendarTask(self.object, self.context.parentContext.object.view);
                self.addRangeAtPathChangeListener("object._simpleSchedule.type", self, "_handleScheduleTypeChange");
                self.addRangeAtPathChangeListener("object._simpleSchedule.type", self, "_handleSimpleScheduleChange");
                self.addRangeAtPathChangeListener("object._simpleSchedule.time", self, "_handleSimpleScheduleChange");
                self.addRangeAtPathChangeListener("object._simpleSchedule.daysOfMonth", self, "_handleSimpleScheduleChange");
                self.addRangeAtPathChangeListener("object._simpleSchedule.daysOfWeek", self, "_handleSimpleScheduleChange");
            });
            if (this.object.task) {
                this.classList.add('type-' + this.object.task.replace('.', '_').toLowerCase());
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

    save: {
        value: function() {
            if (this.argsInspector && typeof this.argsInspector.save === 'function') {
                this.object.args = this.argsInspector.save();
            }
            this._sectionService.updateScheduleOnTask(this.object);
            var argsLength = this.object.args.length;
            this.object.args = this.object.args.filter(function(x) {
                return !!x || (typeof x !== "undefined" && typeof x !== "object") ;
            });
            this.object.args.length = argsLength;
            this._closeInspector();
            return this.inspector.save();
        }
    },

    delete: {
        value: function() {
            this._closeInspector();
            return this.inspector.delete();
        }
    },

    handleRunNowAction: {
        value: function () {
            if (this.argsInspector && typeof this.argsInspector.save === 'function') {
                this.object.args = this.argsInspector.save();
            }
            return this._sectionService.runTask(this.object);
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

    _handleSimpleScheduleChange: {
        value: function() {
            this.scheduleString = this._sectionService.getScheduleStringForTask(this.object);
        }
    },

    _closeInspector: {
        value: function() {
            this.context.cascadingListItem.cascadingList.constructor.findPreviousCascadingListItemContextWithComponent(this).selectedObject = null
        }
    }

}, {
    _CAN_DRAW_FIELD: {
        value: 'isServiceLoaded'
    }
});
