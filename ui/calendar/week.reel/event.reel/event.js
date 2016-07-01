/**
 * @module ui/event.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Event
 * @extends Component
 */
exports.Event = Component.specialize(/** @lends Event# */ {

    _setY: {
        value: function(hours, minutes) {
            var hours =   parseInt(hours);
            var minutes = parseInt(minutes);
            if(minutes) {
                // convert minutes into percentage and set correct decimal placement
                minutes = minutes * (100/60) * .01;
                return hours + minutes;
            } else {
                return hours;
            }
        }
    },

    _setX: {
        value: function() {
            console.log("setY");
        }
    },

    _setWidth: {
        value: function(concurrentEvents) {
            this.element.style.width = 100 / (concurrentEvents + 1) + '%';
        }
    },

    enterDocument: {
        value: function(isFirstTime) {

            console.log(this.object);

            if(!this.object.allDay) {
                // adds style adjustment to position absolute
                this.classList.add('has-time');
                // multiply by height row (3) to get top position
                this.element.style.top = this._setY(this.object.hours, this.object.minutes) * 3 + "em";
                this._setWidth(this.object.concurrentEvents);
            }

            // sets type class

            if (this.object && this.object.type) {
                this.classList.add('type-' + this.object.type.replace('.', '_').toLowerCase());
            }
        }
    }
});
