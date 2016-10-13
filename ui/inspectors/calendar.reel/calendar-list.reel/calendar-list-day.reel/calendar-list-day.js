/**
 * @module ui/calendar-list-day.reel
 */
var Component = require("montage/ui/component").Component,
    monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * @class CalendarListDay
 * @extends Component
 */
exports.CalendarListDay = Component.specialize(/** @lends CalendarListDay# */ {
    events: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
                if (object) {
                    this.fullDate = monthNames[object.month] + " " + object.date;
                    this._loadTasks();
                }
            }
        }
    },

    _selectedDay: {
        value: null
    },

    selectedDay: {
        get: function() {
            return this._selectedDay;
        },
        set: function(selectedDay) {
            if (this._selectedDay !== selectedDay) {
                this._selectedDay = selectedDay;
                if (selectedDay == this._object) {
                    this.element.scrollIntoView();
                }
            }
        }
    },

    _setHasEvents: {
        value: function() {
            this.object._hasEvents = !!this.displayedEvents.length;
        }
    },

    enterDocument: {
        value: function() {
            this.addRangeAtPathChangeListener("displayedEvents", this, "_setHasEvents");
            this._loadTasks();
        }
    },


    _loadTasks: {
        value: function() {
            if (this._object) {
                var self = this;
                this.application.calendarService.getTasksScheduleOnDay(this._object).then(function(tasks) {
                    self.events = tasks;
                });
            }
        }
    }
});
