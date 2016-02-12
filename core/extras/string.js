
if (!String.prototype.toCamelCase) {
    Object.defineProperty(String.prototype, 'toCamelCase', {
        value: function toCamelCase () {
            var trimmed = this.trim(),
                camelCase = toCamelCase.cache[trimmed] || '';

            if (this.length) {
                if (!camelCase) {
                    if (/[^A-Z]/.test(trimmed[0]) || /\.|_|-|\s/.test(trimmed)) {
                        var data = trimmed.split(/\.|_|-|\s/),
                            str;

                        for (var i = 0, length = data.length; i < length; i++) {
                            str = data[i];

                            if (str) {
                                camelCase += str.toCapitalized();
                            }
                        }

                        toCamelCase[trimmed] = camelCase;

                    } else {//already camelCase
                        camelCase = toCamelCase[trimmed] = trimmed;
                    }
                }
            }

            return camelCase;
        },
        writable: true,
        configurable: true
    });

    String.prototype.toCamelCase.cache = Object.create(null);
}
