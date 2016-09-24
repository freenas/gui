var Montage = require("montage").Montage;

//FIXME: quick workaround
exports.BytesService = Montage.specialize({

    convertStringToSize: {
        value: function (string, unit) {
            unit = unit || this.UNITS.K;
            if (typeof string === "string") {
                var parts = string.match(this.constructor._HUMAN_READABLE_REGEX);
                if (parts) {
                    var value = parseInt(parts[1]),
                        suffix = parts[2];
                    if (suffix) {
                        value = value * Math.pow(this.constructor._MULTIPLE, this.constructor._PREFIX_TO_EXPONENT[suffix]) / Math.pow(this.constructor._MULTIPLE, this.constructor._PREFIX_TO_EXPONENT[unit]);
                    }
                    return value;
                }
            }
        }
    },

    convertSizeToString: {
        value: function (size, unit) {
            unit = unit || this.UNITS.K;
            var suffixIndex = this._SUFFIXES.indexOf(unit),
                abbreviatedValue = size;
                
            while (abbreviatedValue % this.constructor._MULTIPLE === 0) {
                suffixIndex++;
                abbreviatedValue = abbreviatedValue / this.constructor._MULTIPLE;
            }
            
            return abbreviatedValue ? abbreviatedValue + this._SUFFIXES[suffixIndex] + "iB": '';
        }
    }

}, {

    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
                this._instance.UNITS = this._instance.constructor.UNITS;
                this._instance._SUFFIXES = Object.keys(this._instance.UNITS);
            }

            return this._instance;
        }
    },

    UNITS: {
        value: {
            K: 'K',
            M: 'M',
            G: 'G',
            T: 'T',
            P: 'P',
            E: 'E',
            Z: 'Z'
        }
    },

    // We're going with 1024 no matter what. This is not up for further discussion.
    _MULTIPLE: {
        value: 1024
    },

    _HUMAN_READABLE_REGEX: {
        value: /^(\d+\.?\d{0,3})([KMGTPEZ]?)?[I]?[B]?$/i
    },

    _PREFIX_TO_EXPONENT: {
        value: {
            K: 1,
            M: 2,
            G: 3,
            T: 4,
            P: 5,
            E: 6,
            Z: 7
        }
    }
});
