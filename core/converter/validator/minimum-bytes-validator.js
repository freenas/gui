/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator,
    IntegerFloorValidator = require("core/converter/validator/integer-floor-validator").IntegerFloorValidator;

exports.MinimumBytesValidator = Validator.specialize({

    SIZE_RE_DECIMALS: {
        value: /^(\d+\.?\d{0,3})([KMGTPEZ]?)?[I]?[B]?$/i
    },

    SIZE_RE: {
        value: /^(\d+)([KMGTPEZ]?)?[I]?[B]?$/i
    },

    SIZE_PREFIX_EXPONENTS: {
        value: {
            K: 1,
            M: 2,
            G: 3,
            T: 4,
            P: 5,
            E: 6,
            Z: 7
        }
    },

    allowDecimal: {
        value: true
    },

    minValue: {
        value: null
    },

    minPrefix: {
        value: null
    },

    errorMessage: {
        value: null
    },

    _integerFloorValidator: {
        value: null
    },

    constructor: {
        value: function() {
            this._integerFloorValidator = new IntegerFloorValidator({floor: this.minValue});
        }
    },

    validate: {
        value: function (input) {
            var parsedInput, prefix, value;
            if (typeof input === "string" && !!input) {
                parsedInput = this.allowDecimal ? input.match(this.SIZE_RE_DECIMALS) : input.match(this.SIZE_RE);
                if (!!parsedInput) {
                    prefix = parsedInput[2];
                    value = parseInt(parsedInput[1]);
                    if (!!prefix) {
                        if (this.SIZE_PREFIX_EXPONENTS[prefix.toUpperCase()] < (this.minPrefix ? this.SIZE_PREFIX_EXPONENTS[this.minPrefix.toUpperCase()] : 1) ) {
                            throw new Error(this.errorMessage);
                        }
                    }
                    try {
                        this._integerFloorValidator.validate(value);
                    } catch (e) {
                        throw new Error(this.errorMessage);
                    }
                } else {
                    throw new Error(this.errorMessage);
                }
            } else if (typeof input === "number" && !this.minPrefix) {
                try {
                    this._integerFloorValidator.validate(input);
                } catch (e) {
                    throw new Error(this.errorMessage);
                }
            } else {
                throw new Error(this.errorMessage);
            }
            return true;
        }
    }

});
