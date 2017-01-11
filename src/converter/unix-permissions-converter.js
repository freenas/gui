/**
 * @requires montage/core/converter/converter
 */
var Converter = require("montage/core/converter/converter").Converter;

/**
 * Convert a permissions object to a permissions mask

 * @class UnixPermissionsConverter
 * @extends UnixPermissionsConverter
 */
 exports.UnixPermissionsConverter = Converter.specialize({
    convert: {
        value: function (object) {
            var mask;
            if (object && object.user && object.group && object.others) {
                mask = '';
                mask += this._getMaskForRight(object.user);
                mask += this._getMaskForRight(object.group);
                mask += this._getMaskForRight(object.others);
            }
            return mask;
        }
    },

    revert: {
        value: function (mask) {
            var modes;
            if (mask.length == 3) {
                modes = { user: {}, group: {}, others: {} };
                this._assignFlagsForSingleType(+mask[0], modes.user);
                this._assignFlagsForSingleType(+mask[1], modes.group);
                this._assignFlagsForSingleType(+mask[2], modes.others);
            }
            return modes;
        }
    },

     _getMaskForRight: {
         value: function(right) {
            return  right.read*4 +
                    right.write*2 +
                    right.execute;
         }
     },

    _assignFlagsForSingleType: {
         value: function(octal, userType) {
             var binary = ("000" + octal.toString(2)).slice(-3);
             userType.read      = !!+binary[0];
             userType.write     = !!+binary[1];
             userType.execute   = !!+binary[2];
         }
     }
 });
