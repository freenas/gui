/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator,
    Ipv6Validator = require("core/converter/validator/ipv6-validator").Ipv6Validator;

/**
  * Verifies that a string is a valid ipv6 address with a netmask separated by a slash
  * 
  * @class Ipv6WithNetmaskValidator
  * @extends Validator
  */
exports.Ipv6WithNetmaskValidator = Validator.specialize({

    _ipv6AddressValidator: {
        value: null
    },

    constructor: {
        value: function() {
            this._ipv6AddressValidator = new Ipv6Validator();
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
                    return this._ipv6AddressValidator.validate(splitValue[0])
                        && splitValue[1] !== '' && splitValue[1] >= 0 && splitValue[1] <= 128;
                }
            } else {
                console.warn('Attempted to test a non-string value as an ipv6 with netmask value.');
            }

            return false;
        }
    }

});
