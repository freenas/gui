/**
 * @module ui/event.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class Event
 * @extends Component
 */
exports.CalendarEvent = Component.specialize(/** @lends Event# */ {
    enterDocument: {
        value: function(isFirstTime) {
            this._setPosition();
            this.classList.add('type-' + this.object.task.name.replace('.', '_').toLowerCase());
        }
    },

    exitDocument: {
        value: function() {
            this.classList.remove('type-' + this.object.task.name.replace('.', '_').toLowerCase());
        }
    },

    prepareForActivationEvents: {
        value: function() {
            var pressComposer = new PressComposer();
            this.addComposer(pressComposer);
            pressComposer.addEventListener("press", this);
            this.element.addEventListener("mouseover", this);
        }
    },

    handlePress: {
        value: function(event) {
            this.selectedTask = this.object.task;
        }
    },

    _resetStyle: {
        value: function() {
            this.element.style.position = '';
            this.element.style.top = '';
        }
    },

    _setPosition: {
        value: function() {
            if(!this.object.allDay) {
                this.classList.add('has-time');
                this._resetStyle();
                // multiply by height row (3) to get top position
                // $FIXME - this value (3) shouldn't be hard coded
                this.element.style.top = this._setY(this.object.hour, this.object.minute) * 3 + "em";
                if (this.object.concurrentEvents > 1) {
                    this.element.style.position = 'relative';
                }
            }
        }
    },

    _setY: {
        value: function(hours, minutes) {
            var hours   = parseInt(hours);
            var minutes = parseInt(minutes);
            if(minutes) {
                // convert minutes into percentage and set correct decimal placement
                minutes = minutes * (100/60) * .01;
                return hours + minutes;
            } else {
                return hours;
            }
        }
    }
});
