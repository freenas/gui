/**
 * @module ui/field.reel
 */
var Component = require("montage/ui/component").Component,
    bindPropertyToClassName = require("core/core").bindPropertyToClassName;

/**
 * @class Field
 * @extends Component
 */
var Field = exports.Field = Component.specialize(/** @lends Field# */ {

    helpShown: {
        value: false
    },

    handleFieldInfoButtonAction: {
        value: function () {
            this.helpShown = !this.helpShown;
        }
    },

    handleCloseHelpButtonAction: {
        value: function () {
            this.helpShown = !this.helpShown;
        }
    }
});

bindPropertyToClassName(Field, "hasError", "has-error");
bindPropertyToClassName(Field, "isValidated", "is-validated");
bindPropertyToClassName(Field, "disabled", "is-disabled");
