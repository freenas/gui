var Component = require("montage/ui/component").Component;

/**
 * @class CronJob
 * @extends Component
 */
exports.CronJob = Component.specialize({
    hourOptions: {
        value: null
    },
    minuteOptions: {
        value: null
    },
    dayOptions: {
        value: null
    },
    monthOptions: {
        value: null
    },
    selection: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var minutes = [];
            for (var i = 0; i < 60; i++) {
                minutes.push({"label": ''+i, "value": i});
            }
            this.minuteOptions = minutes;

            var hours = [];
            for (var i = 0; i < 24; i++) {
                hours.push({"label": ''+i, "value": i});
            }
            this.hourOptions = hours;

            var days = [];
            for (var i = 1; i < 32; i++) {
                days.push({"label": ''+i, "value": i});
            }
            this.dayOptions = days;

            this.monthOptions = [
                {"value": 0, "label": "Jan", "index": 0},
                {"value": 1, "label": "Feb", "index": 1},
                {"value": 2, "label": "Mar", "index": 2},
                {"value": 3, "label": "Apr", "index": 3},
                {"value": 4, "label": "May", "index": 4},
                {"value": 5, "label": "Jun", "index": 5},
                {"value": 6, "label": "Jul", "index": 6},
                {"value": 7, "label": "Aug", "index": 7},
                {"value": 8, "label": "Sep", "index": 8},
                {"value": 9, "label": "Oct", "index": 9},
                {"value": 10, "label": "Nov", "index": 10},
                {"value": 11, "label": "Dec", "index": 11}
            ]

            this.monthSelection = ["January"];
            this.daySelection = [1];
            this.hourSelection = [0];
            this.minuteSelection = [0];
        }
    }

});
