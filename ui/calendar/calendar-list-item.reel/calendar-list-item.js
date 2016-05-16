/**
 * @module ui/calendar-list-item.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CalendarListItem
 * @extends Component
 */
exports.CalendarListItem = Component.specialize(/** @lends CalendarListItem# */ {
    enterDocument: {
        value: function () {
            this.classList.add('type-' + this.object.type.toLowerCase());
        }
    }
});
