/**
 * @requires montage/core/converter/converter
 */
var Converter = require("montage/core/converter/converter").Converter;
var Ipv4NetmaskValidator = require("core/converter/validator/ipv4-netmask-validator").Ipv4NetmaskValidator;

/**
 * Converts a subnet mask value to and from CIDR block format
 * e.g. '255.255.255.0' <-> '24'
 * 
 * @class Ipv4NetmaskConverter
 * @extends Converter
 */
 exports.Ipv4NetmaskConverter = Converter.specialize({

    constructor: {
        value: function() {
            this.validator = new Ipv4NetmaskValidator();
        }
    },

    convert: {
        value: function (prefix) {
            // Invalid input
            if (typeof prefix !== 'number') {
                return prefix;
            }

            // Long representation of netmask
            var long = prefix > 0 ? (-1 << (32 - prefix)) : 0;
            var result;

            for (var i = 0; i < 4; i++) {
                // Convert last 8 digits to decimal format and 
                // append it to the result with '.'
                result = i == 0 ? '' : ('.' + result);
                result = (long & 255).toString() + result;
                // Shift to right and discard last 8 digits
                long = long >>> 8;
            }
            return result;
        }
    },

    revert: {
        value: function (value) {
            // Invalid input
            if (typeof value !== 'string' || !this.validator.validate(value)) {
                return value;
            }

            var result = 0;
            var d = value.split('.');

            for (var i = 0; i < d.length; i++) {
                // Sum up the number of occurrences of '1's 
                // in the binary representations of each decimal part
                result += (parseInt(d[i]).toString(2).match(/1/g) || []).length;
            }

            return result;
        }
    },

    validator: {
        value: null
    }

 });
