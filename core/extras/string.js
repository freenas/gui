
if (!String.prototype.toCamelCase) {
    Object.defineProperty(String.prototype, 'toCamelCase', {
        value: function toCamelCase () {
            var trimmed = this.trim(),
                camelCase = toCamelCase.cache[trimmed] || '';

            if (!camelCase) {
                var data = trimmed.split(/\.|_|-/);

                for (var i = 0, length = data.length; i < length; i++) {
                    camelCase += data[i].toCapitalized();
                }

                toCamelCase[trimmed] = camelCase;
            }

            return camelCase;
        },
        writable: true,
        configurable: true
    });

    String.prototype.toCamelCase.cache = Object.create(null);
}
