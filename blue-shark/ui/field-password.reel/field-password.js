/**
 * @module ui/field-password.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldPassword
 * @extends Component
 */
exports.FieldPassword = Component.specialize(/** @lends FieldPassword# */ {

    disabled: {
        value: false
    },

    editEnabled: {
        value: null
    },

    _value: {
        value: null
    },

    value: {
        set: function (value) {
            if (typeof value === 'object') {
                value = value ? value['$password'] : null;
            }
            if (value != this._value) {
                this._value = value;
                if(this.editEnabled) {
                    this.reset();
                }
            }
        },
        get: function () {
            var password = this._passwordMatch ? this._password1 : this._value;
            return password ? { $password: password } : null;
        }
    },

    _passwordMatch: {
        value: null
    },

    passwordMatch: {
        set: function (passwordMatch) {
            passwordMatch = !!passwordMatch;

            if (passwordMatch !== this._passwordMatch) {
                this._passwordMatch = passwordMatch;
                this.dispatchOwnPropertyChange("value", this.value, false);
            }
        },
        get: function () {
            return this._passwordMatch;
        }
    },

    _password1: {
        value: null
    },

    _password2: {
        value: null
    },

    enterDocument: {
        value: function () {
            if (this.preparedForActivationEvents) {
                this._addEventListeners();
            }
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._addEventListeners();
        }
    },

    exitDocument: {
        value: function () {
            this.reset();
            this.editEnabled = null;
            if (this.preparedForActivationEvents) {
                this.passwordFieldInput2.element.removeEventListener("blur", this, true);
                this.passwordFieldInput2.element.removeEventListener("focus", this, true);
            }
        }
    },

    _addEventListeners: {
        value: function () {
            this.passwordFieldInput2.element.addEventListener("blur", this, true);
            this.element.addEventListener("focus", this, true);
            this.addEventListener("action", this);
        }
    },

    shouldAcceptValue: {
        value: function () {
            return true;
        }
    },

    captureBlur: {
        value: function () {
            if (this._password2) {
                this._checkPasswords();
            }
        }
    },

    captureFocus: {
        value: function (event) {
            var target = event.target;

            if (target === this.passwordFieldInput1.element || target === this.passwordFieldInput2.element) {
                this._password2 = null;
                this._passwordMatch = null;
                this.dispatchOwnPropertyChange("passwordMatch", null, false);
            }
        }
    },

    reset: {
        value: function () {
            this._password2 = this._password1 = null;
            this._passwordMatch = null;

            this.dispatchOwnPropertyChange("value", null, false);
            this.dispatchOwnPropertyChange("passwordMatch", null, false);
        }
    },

    _checkPasswords: {
        value: function () {
            var passwordMatch = true;

            if (this._password1 !== null && this._password2 !== null) {
                passwordMatch = this._password1 === this._password2;
            }

            this.passwordMatch = passwordMatch;
        }
    },

    handleResetAction: {
        value: function () {
            this.value = null;
            this.editEnabled = true;
            this.needsfocus = true;
        }
    },

    draw: {
        value: function () {
            if(this.needsfocus) {
                this.passwordFieldInput1.focus();
                this.needsfocus = false;
            }
        }
    }

});
