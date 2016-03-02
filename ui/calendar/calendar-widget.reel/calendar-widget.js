var Component = require("montage/ui/component").Component;

exports.CalendarWidget = Component.specialize({

    constructor: {
        value: function () {
            this.super();
            this._updateCalendar();
        }
    },

    _months: {
        value: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
    },

    months: {
        get: function () {
            return this._months;
        },
        set: function (value) {
            this._months = value;
            this.needsDraw = true;
        }
    },

    _selectedTimestamp: {
        value: null
    },

    _daysOfTheWeek: {
        value: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },

    daysOfTheWeek: {
        get: function () {
            return this._daysOfTheWeek;
        },
        set: function (value) {
            this._daysOfTheWeek = value;
            this.needsDraw = true;
        }
    },

    _firstDayOfTheWeek: {
        value: "Sunday"
    },

    firstDayOfTheWeek: {
        get: function () {
            return this._firstDayOfTheWeek;
        },
        set: function (value) {
            if (value === "Monday") {
                this._firstDayOfTheWeek = value;
            } else {
                this._firstDayOfTheWeek = "Sunday";
            }
            this.needsDraw = true;
        }
    },

    _daysInMonth: {
        value: function (year, month) {
            return new Date(year, month + 1, 0).getDate();
        }
    },

    _updateCalendar: {
        value: function () {
            var timestamp = this._selectedTimestamp ? this._selectedTimestamp : Date.now(),
                date = new Date(timestamp),
                month = date.getMonth(),
                daysInMonth,
                weeks = [],
                dayDate,
                today = new Date(),
                week,
                i, j;

            this._month = this._months[month];
            this._year = date.getFullYear();
            daysInMonth = this._daysInMonth(this._year, month);
            if (this._firstDayOfTheWeek === "Monday") {
                this.daysOfTheWeekContentForRepetition = this.daysOfTheWeek.slice(1);
                this.daysOfTheWeekContentForRepetition.push(this.daysOfTheWeek[0]);
                i = (8 - new Date(this._year, month, 1).getDay()) % 7;
            } else {
                this.daysOfTheWeekContentForRepetition = this.daysOfTheWeek;
                i = 7 - new Date(this._year, month, 1).getDay();
            }
            if (i) {
                i -= 7;
            }
            while (i < daysInMonth) {
                week = [];
                for (j = 1; j <= 7; j++) {
                    dayDate = new Date(this._year, month, i + j);
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
            this._weeks = weeks;
        }
    },

    willDraw: {
        value: function () {
            this._updateCalendar();
        }
    },

    handlePreviousMonthAction: {
        value: function () {
            var timestamp = this._selectedTimestamp ? this._selectedTimestamp : Date.now(),
                date = new Date(timestamp),
                year = date.getFullYear(),
                month = date.getMonth();

            this._selectedTimestamp = new Date(year, month - 1, 1);
            this.needsDraw = true;
        }
    },

    handleTodayAction: {
        value: function () {
            this._selectedTimestamp = new Date();
            this.needsDraw = true;
        }
    },

    handleNextMonthAction: {
        value: function () {
            var timestamp = this._selectedTimestamp ? this._selectedTimestamp : Date.now(),
                date = new Date(timestamp),
                year = date.getFullYear(),
                month = date.getMonth();

            this._selectedTimestamp = new Date(year, month + 1, 1);
            this.needsDraw = true;
        }
    }

});
