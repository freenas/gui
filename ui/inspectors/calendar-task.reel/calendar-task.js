var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
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
            delete this.object.status;
            var savePromise = this._sectionService.saveTask(this.object);
            this.inspector.clearObjectSelection();
            return savePromise;
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
    }

}, {
    _CAN_DRAW_FIELD: {
        value: 'isServiceLoaded'
    }
});
