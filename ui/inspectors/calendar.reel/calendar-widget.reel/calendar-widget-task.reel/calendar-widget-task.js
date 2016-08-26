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
    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                if (this._object) {
                    this.classList.remove('type-' + this._object.task.replace('.', '_').toLowerCase());
                }
                this._object = object;
                if (object) {
                    this.classList.add('type-' + object.task.replace('.', '_').toLowerCase());
                }
            }
        }
    },

    enterDocument: {
        value: function () {
            this.classList.add('type-' + this._object.task.replace('.', '_').toLowerCase());
        }
    },

    exitDocument: {
        value: function () {
            this.classList.remove('type-' + this._object.task.replace('.', '_').toLowerCase());
        }
    },

    prepareForActivationEvents: {
        value: function () {
            var pressComposer = new PressComposer();
            this.addComposer(pressComposer);
            pressComposer.addEventListener("press", this);
            this.element.addEventListener("mouseover", this);
        }
    },

    handlePress: {
        value: function () {
            this.selectedTask = this.object;
        }
    }
});
