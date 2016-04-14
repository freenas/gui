var Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

exports.IpRangeConverter = Converter.specialize({

    _from: {
        value: 0
    },

    from: {
        set: function (from) {
            this._from = ~~from;
        },
        get: function () {
            return this._from;
        }
    },

    _to: {
        value: 65535
    },

    to: {
        set: function (to) {
            this._to = ~~to;
        },
        get: function () {
            return this._to;
        }
    },

    convert: {
        value: function (value) {
            if (value !== null && value !== void 0 && value !== "") {
                value = parseInt(value);
            }

            return value;
        }
    },

    revert: {
        value: function (value) {
            if (value !== null && value !== void 0 && value !== "") {
                value = parseInt(value);

                this.validator.validate(value);
            }

            return value;
        }
    },

    _validator: {
        value: null
    },

    validator: {
        set: function (validator) {
            this._validator = validator;
        },
        get: function () {
            if (!this._validator) {
                this._validator = new NumberRangeValidator();
                this._validator.from = this.from;
                this._validator.to = this.to;
            }

            return this._validator;
        }
    }
});

var NumberRangeValidator = exports.NumberRangeValidator = Validator.specialize({

    _from: {
        value: 0
    },

    from: {
        set: function (from) {
            this._from = ~~from;
        },
        get: function () {
            return this._from;
        }
    },

    _to: {
        value: 0
    },

    to: {
        set: function (to) {
            this._to = ~~to;
        },
        get: function () {
            return this._to;
        }
    },

    validate: {
        value: function (number) {
            number = ~~number;

            if (number >= this.from && number <= this.to) {
                return true;
            }

            throw new Error("Valid range: " + this.from + "-" + this.to);
        }
    }

});
