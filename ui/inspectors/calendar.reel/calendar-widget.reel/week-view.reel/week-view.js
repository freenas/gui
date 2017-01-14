var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Week
 * @extends Component
 */
exports.WeekView = Component.specialize({

    _firstDayOfWeek: {
        value: null
    },

    firstDayOfWeek: {
        get: function() {
            return this._firstDayOfWeek;
        },
        set: function(firstDayOfWeek) {
            if (this._firstDayOfWeek !== firstDayOfWeek) {
                this._firstDayOfWeek = firstDayOfWeek;
                if (firstDayOfWeek) {
                    this.gotoToday();
                }
            }
        }
    },

    _monthsCache: {
        value: null
    },

    _months: {
        get: function() {
            if (!this._monthsCache) {
                this._monthsCache = this.application.calendarService.MONTHS.map(function(x) {
                    return x.substr(0, 3);
                });
            }
            return this._monthsCache;
        }
    },

    enterDocument: {
        value: function () {
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
            var currentPeriod = new Date(),
                dayOfWeek = (currentPeriod.getDay() + 7 - (this.firstDayOfWeek || 0)) % 7;

            currentPeriod.setDate(currentPeriod.getDate() - dayOfWeek);
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
                        (dayDate.getMonth() === today.getMonth()),
                    rawDate: dayDate
                });
            }
            Promise.each(days, function(day) {
                return self.application.sectionService.getTasksScheduleOnDay(day).then(function(tasks) {
                    day.events = tasks;
                });
            });
            this.days = days;
            this.displayedPeriodLabel = this._getDisplayedLabel();
        }
    },

    _getDisplayedLabel: {
        value: function() {
            var first = this.days[0],
                last = this.days[6],
                result;
            if (first.year != last.year) {
                result = [
                    this._months[first.month],
                    first.date + ',',
                    first.year,
                    '-',
                    this._months[last.month],
                    last.date + ',',
                    last.year
                ];
            } else if (first.month != last.month) {
                result = [
                    this._months[first.month],
                    first.date,
                    '-',
                    this._months[last.month],
                    last.date + ',',
                    last.year
                ];
            } else {
                result = [
                    this._months[first.month],
                    first.date,
                    '-',
                    last.date + ',',
                    last.year
                ];
            }
            return result.join(' ');
        }
    }
});
