/**
 * @requires montage/core/converter/converter
 */
var Converter = require("montage/core/converter/converter").Converter;

/**
 * Convert comma separated IP addresses to and from array
 * 
 * @class IpAddressesConverter
 * @extends Converter
 */
 exports.IpAddressesConverter = Converter.specialize({

    convert: {
        value: function (value) {
            if (typeof value !== 'string') {
                return (value || []).join(',');
            }
            return value;
        }
    },

    revert: {
        value: function (value) {
            if (typeof value === 'string') {
                return value.split(',').map(function(ip) {
                    return ip.trim();
                });
            }
            return value;
        }
    }

 });
