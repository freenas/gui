/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;
var IPv4Validator = require("core/converter/validator/ipv4-validator").IPv4Validator;

/**
  * Verifies that a string is a valid ipv4 address with a netmask separated by a slash
  * @class IPv4WithNetmaskValidator
  * @extends Validator
  */

exports.IPv4WithNetmaskValidator = Validator.specialize({

    validate: {
        value: function (value) {
            // We're only checking strings here. This is just to protect against
            // weird inputs. An exception may also be suitable in the future.
            if (typeof value === "string" ) {
                // Split the string on the "/" to separate the ip and netmask
                var splitValue = value.split("/");
                // There may only be one "/", no more and no less
                if (splitValue.length === 2) {
                    if (new IPv4Validator().validate(splitValue[0])
                     // "" >= 0, catch this case
                     && splitValue[1] !== ""
                     // IPv4 netmasks range from 0 to 32
                     && splitValue[1] >= 0
                     && splitValue[1] <= 32) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                console.warn("Attempted to test a non-string value as an ipv4 with netmask value.");
                return false;
            }
        }
    }

});
