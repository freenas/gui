/**
 * @module ui/timezone-picker.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TimezonePicker
 * @extends Component
 */
exports.TimezonePicker = Component.specialize(/** @lends TimezonePicker# */ {
    draw: {
        value: function() {
            $(this.imageElement).timezonePicker({
              pin: '.timezone-pin',
              fillColor: 'FFCCCC',
              changeHandler: this.handleChange.bind(this)
            });
        }
    },
    handleChange: {
        value: function(timezone, country, offset) {
            this.timezone = timezone;
            this.country = country;
            this.offset = offset;
        }
    }
});
