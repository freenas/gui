/**
 * @module ui/password.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Password
 * @extends Component
 */
exports.Password = Component.specialize({

    //FIXME: workaround
    enabled: {
        value: true
    },

    __password: {
        value: null
    },

    _password: {
        get: function() {
            return this.__password;
        },
        set: function(strPassword) {
            if (this.__password !== strPassword) {
                this.__password = strPassword;
                this.dispatchOwnPropertyChange('password', this.password);
            }
        }
    },

    password: {
        get: function() {
            return this._password ? { $password: this._password } : null;
        },
        set: function(password) {
            if (typeof password === 'object') password = password ? password['$password'] : null;
            if (this.__password !== password) {
                this.__password = password;
                this.dispatchOwnPropertyChange('_password', this._password);
            }
        }
    }
});
