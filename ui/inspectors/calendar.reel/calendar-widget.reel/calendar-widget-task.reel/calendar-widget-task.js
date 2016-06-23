/**
 * @module ui/inspectors/calendar.reel/calendar-widget.reel/calendar-widget-task.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class CalendarWidgetTask
 * @extends Component
 */
exports.CalendarWidgetTask = Component.specialize(/** @lends CalendarWidgetTask# */ {
    enterDocument: {
        value: function () {
            this.classList.add('type-' + this.object.name.replace('.', '_').toLowerCase());
        }
    },

    exitDocument: {
        value: function () {
            this.classList.remove('type-' + this.object.name.replace('.', '_').toLowerCase());
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
            this.selectedTask = this.object;
        }
    }
});
