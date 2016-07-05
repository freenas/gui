/**
 * @module ui/calendar/week.reel/day-header.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class DayHeader
 * @extends Component
 */
exports.DayHeader = Component.specialize(/** @lends DayHeader# */ {
    daysOfWeek: {
        get: function() {
            return this.application.calendarService.DAYS_OF_WEEK;
        }
    }
});
