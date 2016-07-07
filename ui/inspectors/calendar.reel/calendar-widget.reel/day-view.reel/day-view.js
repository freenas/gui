var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Day
 * @extends Component
 */
exports.DayView = Component.specialize({
    enterDocument: {
        value: function (isFirstTime) {
            this.gotoToday();
        }
    },

    gotoPrevious: {
        value: function() {
            this._today.setDate(this._today.getDate()-1);
            this._updateCalendar();
        }
    },

    gotoToday: {
        value: function() {
            var today = new Date();
            today.setDate(today.getDate());
            this._today = today;
            this._updateCalendar();
        }
    },

    gotoNext: {
        value: function() {
            this._today.setDate(this._today.getDate()+1);
            this._updateCalendar();
        }
    },

    _updateCalendar: {
        value: function() {
            var self = this,
                year = this._today.getFullYear(),
                month = this._today.getMonth(),
                date = this._today.getDate(),
                today = new Date(),
                dayDate = new Date(year, month, date);
                displayedDay = {
                    year:   dayDate.getFullYear(),
                    month:  dayDate.getMonth(),
                    date:   dayDate.getDate(),
                    rawDate: dayDate,
                    day: dayDate.getDay(),
                    isToday:
                        (dayDate.getDate() === today.getDate()) &&
                        (dayDate.getFullYear() === today.getFullYear()) &&
                        (dayDate.getMonth() === today.getMonth())
                }
            self.application.calendarService.getTasksScheduleOnDay(dayDate.getDay()).then(function(tasks){
                displayedDay.events = tasks;
            });
            this.displayedDay = displayedDay;
            this.days = [];
            this.days.push(this.displayedDay);
        }
    }
});
