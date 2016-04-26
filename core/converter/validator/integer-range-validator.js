/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator,
    IntegerFloorValidator = require("core/converter/validator/integer-floor-validator").IntegerFloorValidator,
    IntegerCeilingValidator = require("core/converter/validator/integer-ceiling-validator").IntegerCeilingValidator;

exports.IntegerRangeValidator = Validator.specialize({

    _integerFloorValidator: {
        value: null
    },

    _integerCeilingValidator: {
        value: null
    },

    _floor: {
        value: null
    },

    _ceiling: {
        value: null
    },

    floor: {
        get: function() {
            return this._floor;
        },

        set: function(newFloor) {
            this._floor = newFloor;
            this._integerFloorValidator.floor = newFloor;
        }
    },

    ceiling: {
        get: function() {
            return this._ceiling;
        },

        set: function(newCeiling) {
            this._ceiling= newCeiling;
            this._integerCeilingValidator.ceiling = newCeiling;
        }
    },

    errorMessage: {
        value: null
    },

    constructor: {
        value: function() {
            this._integerFloorValidator = new IntegerFloorValidator();
            this._integerCeilingValidator = new IntegerCeilingValidator();
        }
    },

    validate: {
        value: function (value) {
            try {
                if (typeof this.floor === "number") {
                    this._integerFloorValidator.validate(value);
                }
                if (typeof this.ceiling === "number") {
                    this._integerCeilingValidator.validate(value);
                }
                return true;
            } catch (e) {
                throw new Error(this.errorMessage);
            }
        }
    }

});
