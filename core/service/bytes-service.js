var Montage = require("montage").Montage,
    application = require("montage/core/application").application;

//FIXME: quick workaround
exports.BytesService = Montage.specialize({

    convertStringToMemsize: {
        value: function (memoryString) {
            if (typeof memoryString === "string") {
                var app = this.application,
                    parsedMemsize = memoryString.match(app.storageService.SCALED_NUMERIC_RE_),
                    memsize,
                    memsizePrefix,
                    memsizeMultiplier = 1;

                if (parsedMemsize && parsedMemsize.length > 1) {
                    memsize = parseInt(parsedMemsize[1]);

                    if (parsedMemsize[2]) {
                        memsizePrefix = parsedMemsize[2].charAt(0).toUpperCase();

                        // We're going with 1024 no matter what. This is not up for 
                        // further discussion.
                        memsizeMultiplier = Math.pow(
                            1024, 
                            app.storageService.SIZE_PREFIX_EXPONENTS[memsizePrefix] - 2
                        );
                    }
                }

                return memsize * memsizeMultiplier;
            }
            
            return 0;
        }
    },

    convertMemsizeToString: {
        value: function (memsize) {
            var prefixIndex = 2,
                result = memsize,
                sizePrefixExponents = this.application.storageService.SIZE_PREFIX_EXPONENTS,
                sizePrefixes = Object.keys(sizePrefixExponents);

            while (result % 1024 === 0) {
                prefixIndex++;
                result = result / 1024;
            }

            for (var i = 1, length = sizePrefixes.length; i<=length; i++) {
                if (sizePrefixExponents[sizePrefixes[i]] === prefixIndex) {
                    result += sizePrefixes[i] + "iB";
                    break;
                }

                result += "";
            }

            return result;
        }
    }

}, {

    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
                this._instance.application = application;
            }

            return this._instance;
        }
    }
});
