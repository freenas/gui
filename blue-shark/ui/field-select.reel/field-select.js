/**
 * @module ui/field-select.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldSelect
 * @extends Component
 */
exports.FieldSelect = Component.specialize(/** @lends FieldSelect# */ {
    _options: {
        value: null
    },

    options: {
        get: function() {
            return this._options;
        },
        set: function (options) {
            if (Array.isArray(options)) {
                this._options = options;
            } else {
                this._options = null;
            }
        }
    }
});
