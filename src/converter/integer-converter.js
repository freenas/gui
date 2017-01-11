var NumberConverter = require("montage/core/converter/number-converter").NumberConverter;

exports.IntegerConverter = NumberConverter.specialize({

    /**
     * @type {boolean}
     * @default {boolean} false
     */
    allowFloat: {
        value: false
    },

    /**
     * @type {boolean}
     * @default {boolean} false
     */
    allowNegative: {
        value: false
    },

    /**
     * @function
     * @param {number} value The value to convert.
     * @returns {string}
     */
    convert: {
        value: function (v) {
            var num;
            if (this.round) {
                num = Number(Math.round(v)).toString();
            } else {
                var ex = Math.pow(10, this.decimals || 2);
                var scale = 1;
                num = Number(Math.round(v / scale * ex) / ex);
            }

            return num;
        }
    }

});
