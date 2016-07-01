/**
 * @module ui/event.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Event
 * @extends Component
 */
exports.Event = Component.specialize(/** @lends Event# */ {

    positionEvent: {
        value: function(time) {
            var hours =   parseInt(time.substring(0,2));
            var minutes = parseInt(time.substring(3));
            if(minutes > 0) {
                // convert minutes into percentage and set correct decimal placement
                minutes = minutes * (100/60) * .01;
                return hours + minutes;
            } else {
                return hours;
            }
        }
    },

    enterDocument: {
        value: function() {
            // multiply by height row (3) to get top position
            this.element.style.top = this.positionEvent(this.object.time) * 3 + "em";
        }
    }
});
