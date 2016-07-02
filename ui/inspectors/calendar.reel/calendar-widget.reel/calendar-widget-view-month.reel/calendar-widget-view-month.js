/**
 * @module ui/calendar-widget-view-month.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CalendarWidgetViewMonth
 * @extends Component
 */
exports.CalendarWidgetViewMonth = Component.specialize(/** @lends CalendarWidgetViewMonth# */ {
    _months: {
        get: function() {
            return this.application.calendarService.MONTHS;
        }
    },

    daysOfTheWeek: {
        get: function() {
            return this.application.calendarService.DAYS_OF_WEEK;
        }
    },

    enterDocument: {
        value: function() {
            this.gotoToday();
        }  
    },

    gotoPrevious: {
        value: function() {
            this._currentPeriod.setMonth(this._currentPeriod.getMonth()-1);
            this._updateCalendar();
        }
    },

    gotoToday: {
        value: function() {
            var currentPeriod = new Date();
            currentPeriod.setDate(1);
            this._currentPeriod = currentPeriod;
            this._updateCalendar();
        }
    },

    gotoNext: {
        value: function() {
            this._currentPeriod.setMonth(this._currentPeriod.getMonth()+1);
            this._updateCalendar();
        }
    },

    willDraw: {
        value: function () {
            this._updateCalendar();
        }
    },

    _daysInMonth: {
        value: function (year, month) {
            return new Date(year, month + 1, 0).getDate();
        }
    },

    _updateCalendar: {
        value: function () {
            var month = this._currentPeriod.getMonth(),
                year = this._currentPeriod.getFullYear(),
                daysInMonth = this._daysInMonth(year, month),
                weeks = [],
                dayDate,
                today = new Date(),
                week,
                i, j;
            if (this._firstDayOfTheWeek === "Monday") {
                this.daysOfTheWeekContentForRepetition = this.daysOfTheWeek.slice(1);
                this.daysOfTheWeekContentForRepetition.push(this.daysOfTheWeek[0]);
                i = (8 - new Date(year, month, 1).getDay()) % 7;
            } else {
                this.daysOfTheWeekContentForRepetition = this.daysOfTheWeek;
                i = 7 - new Date(year, month, 1).getDay();
            }
            if (i) {
                i -= 7;
            }
            while (i < daysInMonth) {
                week = [];
                for (j = 1; j <= 7; j++) {
                    dayDate = new Date(year, month, i + j);
                    week.push({
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
                weeks.push(week);
                i += 7;
            }
            this.displayedPeriodLabel = this._months[month] + " " + year;
            this.weeks = weeks;
        }
    }
});
