/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator,
    Ipv4Validator = require("core/converter/validator/ipv4-validator").Ipv4Validator,
    Montage = require("montage/core/core").Montage;

/**
  * Verifies that a string is a valid ipv4 netmask or CIDR prefix
  *
  * @class Ipv4NetmaskValidator
  * @extends Validator
  */
var Ipv4NetmaskValidator = exports.Ipv4NetmaskValidator = Validator.specialize({

    _ipv4AddressValidator: {
        value: null
    },

    _ip2Binary: {
        value: function(ip) {
            return ip.split('.').reduce(function(carry, dec) {
                return carry + ('00000000' + (+dec).toString(2)).slice(-8);
            }, '');
        }
    },

    constructor: {
        value: function() {
            this._ipv4AddressValidator = new Ipv4Validator();
        }
    },

    validate: {
        value: function (netmask) {
            try {
                if (typeof netmask === 'string') {
                    if (this._ipv4AddressValidator.validate(netmask)) {
                        // Check if there's any `1` coming after `0`
                        if (this._ip2Binary(netmask).indexOf('01') === -1)
                            return true;
                    }
                }
            }
            catch (e) {
                throw new Error('Invalid subnet mask')
            }
        }
    }

});
