exports.bindPropertyToClassName = function bindPropertyToClassName (constructor, propertyName, className, isReversed) {
    var privatePropertyName = "_" + propertyName;

    constructor.prototype["_" + privatePropertyName] = false;

    Object.defineProperty(constructor.prototype, propertyName, {
        set: function (value) {
            if (typeof value === "boolean" && this[privatePropertyName] !== value) {
                this[privatePropertyName] = value;

                if ((value && !isReversed) || (isReversed && !value)) {
                    this.classList.add(className);
                } else {
                    this.classList.remove(className);
                }
            } else {
                this.classList.remove(className);
                this[privatePropertyName] = null;
            }
        },
        get: function () {
            return this[privatePropertyName];
        }
    });
};
