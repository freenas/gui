/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;
var Ipv4WithNetmaskValidator = require("core/converter/validator/ipv4-with-netmask-validator").Ipv4WithNetmaskValidator;
var Ipv6WithNetmaskValidator = require("core/converter/validator/ipv6-with-netmask-validator").Ipv6WithNetmaskValidator;


/**
  * Verifies that a string is a valid ipv6 address with a netmask separated by a slash
  * 
  * @class Ipv4OrIpv6WithNetmaskValidator
  * @extends Validator
  */
exports.Ipv4OrIpv6WithNetmaskValidator = Validator.specialize({

    constructor: {
        value: function() {
            this.v4validator = new Ipv4WithNetmaskValidator();
            this.v6validator = new Ipv6WithNetmaskValidator();
        }
    },

    validate: {
        value: function (value) {
            if (value.indexOf(':') != -1 && this.v6validator.validate(value)) {
                return true;
            }
            else if (this.v4validator.validate(value)) {
                return true;
            }
            else {
                return false;
            }
        }
    },

    v4validator: {
        value: null
    },

    v6validator: {
        value: null
    }

});
