/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;
var Montage = require("montage/core/core").Montage;

/**
  * Verifies that a string is a valid ipv4 address
  * @class IPv4Validator
  * @extends Validator
  */

var IPv4Validator = exports.IPv4Validator = Validator.specialize({

    validate: {
        value: function (address) {
            return /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/.test(address);
        }
    }

});
