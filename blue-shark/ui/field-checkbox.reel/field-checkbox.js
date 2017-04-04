/**
 * @module ui/field-checkbox.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldCheckbox
 * @extends Component
 */
exports.FieldCheckbox = Component.specialize(/** @lends FieldCheckbox# */ {

    _checked: {
        value: false
    },

    checked: {
        set: function (checked) {
            this._checked = !!checked;
        },
        get: function () {
            return this._checked;
        }
    }

});
