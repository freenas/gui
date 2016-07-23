/**
 * @module ui/controls/traffic-light.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TrafficLight
 * @extends Component
 */
exports.TrafficLight = Component.specialize(/** @lends TrafficLight# */ {
    _value: {
        value: null
    },

    value: {
        get: function() {
            return this._value;
        },
        set: function(value) {
            if (this._value !== value) {
                this._value = value;
                this._oldStatusClasses.push(this._statusClass);
                if (value && this.colorMapping) {
                    this._statusClass = 'is-' + this.colorMapping[value];
                }
                this.needsDraw = true;
            }
        }
    },

    constructor: {
        value: function() {
            this._oldStatusClasses = [];
        }
    },

    draw: {
        value: function() {
            this._cleanupClasses();
            if (this._statusClass) {
                this.element.classList.add(this._statusClass);
            }
        }
    },

    exitDocument: {
        value: function() {
            this._cleanupClasses(true);
        }
    },

    _cleanupClasses: {
        value: function(removeCurrent) {
            var oldClass;
            if (this._oldStatusClasses && this._oldStatusClasses.length > 0) {
                while (oldClass = this._oldStatusClasses.pop()) {
                    this.element.classList.remove(oldClass);
                }
            }
            if (removeCurrent && this._statusClass) {
                this.element.classList.remove(this._statusClass);
            }
        }
    }
});
