
if (!String.prototype.toCamelCase) {
    function _toCamelCase (sring, cache, isLower) {
        var trimmed = sring.trim(),
            camelCase = cache[trimmed] || '';

        if (!camelCase && trimmed.length) {
            if ((!isLower && /[^A-Z]/.test(trimmed[0])) || /\.|_|-|\s/.test(trimmed)) {
                var data = trimmed.split(/\.|_|-|\s/),
                    str;

                for (var i = 0, length = data.length; i < length; i++) {
                    str = data[i];

                    if (str) {
                        if (isLower && i === 0) {
                            camelCase += str;
                        } else {
                            camelCase += str.toCapitalized();
                        }
                    }
                }

                cache[trimmed] = camelCase;

            } else { // already camelCase
                camelCase = cache[trimmed] = trimmed;
            }
        }

        return camelCase;
    }


    Object.defineProperty(String.prototype, 'toCamelCase', {
        value: function toCamelCase() {
            return _toCamelCase(this, toCamelCase.cache);
        },
        writable: true,
        configurable: true
    });

    String.prototype.toCamelCase.cache = Object.create(null);


    Object.defineProperty(String.prototype, 'toLowerCamelCase', {
        value: function toLowerCamelCase () {
            return _toCamelCase(this, toLowerCamelCase.cache, true);
        },
        writable: true,
        configurable: true
    });

    String.prototype.toLowerCamelCase.cache = Object.create(null);
}
