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

    validate: {
        value: function (netmask) {
            if (typeof netmask === 'string') {
                // Subnet mask should be a valid IP address
                if (new Ipv4Validator().validate(netmask)) {
                    // Split by dots
                    var d = netmask.split('.');
                    // Convert to binary format
                    var b = ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256+(+d[3])).toString(2);
                    // Check if there's any `1` coming after `0`
                    // Binary should be either 32-bits long or `0`
                    // Maybe a better solution would be zero padding and check?
                    if ((b.length >= 32 && b.indexOf('01') === -1) || b === '0')
                        return true;
                }
            } else {
                // CIDR prefix should be 0 - 32
                if (netmask !== '' && netmask >= 0 && netmask <= 32) 
                    return true;
            }
            throw new Error('Invalid subnet mask');
        }
    }

});
