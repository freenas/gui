var Component = require("montage/ui/component").Component;

/**
 * @class Calendar
 * @extends Component
 */
exports.Calendar = Component.specialize({
    events: {
        value: null
    },

// FIXME: Should be a middleware provided enum
    taskCategories: {
        value: [
            { name: "Scrub", value: "volume.scrub" },
            { name: "Replication", value: "replication.replicate_dataset" },
            { name: "Smart", value: "disk.parallel_test" },
            { name: "Update", value: "update.checkfetch" },
//            { name: "Snapshot", value: "" }
        ]
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            this.application.calendarService.getCalendarInstance().then(function(calendar) {
                self.calendar = calendar;
            });
//            this.application.calendarService.listTasks().then(function(tasks) {
//                self.tasks = tasks;
//            });
        }
    }

});
