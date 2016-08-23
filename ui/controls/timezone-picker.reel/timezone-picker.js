/**
 * @module ui/timezone-picker.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TimezonePicker
 * @extends Component
 */
exports.TimezonePicker = Component.specialize(/** @lends TimezonePicker# */ {
    _timezone: {
        value: null
    },

    timezone: {
        get: function() {
            return this._timezone;
        },
        set: function(timezone) {
            if (this._timezone !== timezone) {
                this._timezone = timezone;
                if (timezone) {
                    $(this.imageElement).timezonePicker('updateTimezone', timezone);
                }
            }
        }
    },

    draw: {
        value: function() {
            $(this.imageElement).timezonePicker({
              pin: '.timezone-pin',
              fillColor: 'FFCCCC',
              changeHandler: this._handleChange.bind(this)
            });
        }
    },

    _handleChange: {
        value: function(timezone, country, offset) {
            this.timezone = timezone;
            this.country = country;
            this.offset = offset;
        }
    }
});
