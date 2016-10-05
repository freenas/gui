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
                {"value": "January", "label": "Jan", "index": "0"},
                {"value": "February", "label": "Feb", "index": "1"},
                {"value": "March", "label": "Mar", "index": "2"},
                {"value": "April", "label": "Apr", "index": "3"},
                {"value": "May", "label": "May", "index": "4"},
                {"value": "June", "label": "Jun", "index": "5"},
                {"value": "July", "label": "Jul", "index": "6"},
                {"value": "August", "label": "Aug", "index": "7"},
                {"value": "September", "label": "Sep", "index": "8"},
                {"value": "October", "label": "Oct", "index": "9"},
                {"value": "November", "label": "Nov", "index": "10"},
                {"value": "December", "label": "Dec", "index": "11"}
            ]

            this.monthSelection = ["January"];
            this.daySelection = [1];
            this.hourSelection = [0];
            this.minuteSelection = [0];
        }
    }

});
