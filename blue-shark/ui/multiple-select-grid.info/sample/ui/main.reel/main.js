/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    minutesContent: {
        value: null
    },
    daysContent: {
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
            this.minutesContent = minutes;/*[
                {"index": 1, "label": "M", "value": "monday"},
                {"index": 0, "label": "S", "value": "sunday"},
                {"index": 2, "label": "T", "value": "tuesday"},
                {"index": 3, "label": "W", "value": "wednesday"},
                {"index": 4, "label": "Th", "value": "thursday"},
                {"index": 5, "label": "F", "value": "friday"},
                {"index": 6, "label": "S", "value": "saturday"}
            ];*/

            this.daysContent = [
                {"index": 1, "label": "M", "value": "monday"},
                {"index": 0, "label": "S", "value": "sunday"},
                {"index": 2, "label": "T", "value": "tuesday"},
                {"index": 3, "label": "W", "value": "wednesday"},
                {"index": 4, "label": "Th", "value": "thursday"},
                {"index": 5, "label": "F", "value": "friday"},
                {"index": 6, "label": "S", "value": "saturday"}
            ];
            this.selectedOnOpen = ['monday', 'wednesday'];
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
        }
    }
});
