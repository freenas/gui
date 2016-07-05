var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Week
 * @extends Component
 */
exports.WeekView = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            this.gotoToday();
        }
    },

    gotoPrevious: {
        value: function() {
            this._currentPeriod.setDate(this._currentPeriod.getDate()-7);
            this._updateCalendar();
        }
    },

    gotoToday: {
        value: function() {
            var currentPeriod = new Date();
            currentPeriod.setDate(currentPeriod.getDate() - currentPeriod.getDay());
            this._currentPeriod = currentPeriod;
            this._updateCalendar();
        }
    },

    gotoNext: {
        value: function() {
            this._currentPeriod.setDate(this._currentPeriod.getDate()+7);
            this._updateCalendar();
        }
    },

    _updateCalendar: {
        value: function() {
            var self = this,
                year = this._currentPeriod.getFullYear(),
                month = this._currentPeriod.getMonth(),
                date = this._currentPeriod.getDate(),
                today = new Date(),
                dayDate,
                days = [];
            for (var i = 0; i < 7; i++) {
                dayDate = new Date(year, month, date + i);
                days.push({
                    year: dayDate.getFullYear(),
                    month: dayDate.getMonth(),
                    date: dayDate.getDate(),
                    day: dayDate.getDay(),
                    isCurrentMonth: dayDate.getMonth() === month,
                    isToday:
                        (dayDate.getDate() === today.getDate()) &&
                        (dayDate.getFullYear() === today.getFullYear()) &&
                        (dayDate.getMonth() === today.getMonth())
                });
            }
            Promise.each(days, function(day) {
                return self.application.calendarService.getTasksScheduleOnDay(day).then(function(tasks) {
                    day.events = tasks;
                });
            });
            this.days = days;
        }
    }
});
