/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator,
    Ipv4Validator = require("core/converter/validator/ipv4-validator").Ipv4Validator;

/**
  * Verifies that a string is a valid ipv4 address with a netmask separated by a slash
  * 
  * @class Ipv4WithNetmaskValidator
  * @extends Validator
  */
exports.Ipv4WithNetmaskValidator = Validator.specialize({

    _ipv4AddressValidator: {
        value: null
    },

    constructor: {
        value: function() {
            this._ipv4AddressValidator = new Ipv4Validator();
        }
    },

    validate: {
        value: function (value) {
            // We're only checking strings here. This is just to protect against
            // weird inputs. An exception may also be suitable in the future.
            if (typeof value === 'string' ) {
                var splitValue = value.split('/');
                // There may only be one '/', no more and no less
                if (splitValue.length === 2) {
                    return this._ipv4AddressValidator.validate(splitValue[0])
                        && splitValue[1] !== '' && splitValue[1] >= 0 && splitValue[1] <= 32;
                }
            } else {
                console.warn('Attempted to test a non-string value as an ipv4 with netmask value.');
            }

            return false;
        }
    }

});
