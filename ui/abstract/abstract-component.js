var Component = require("montage/ui/component").Component;

var AbstractComponent = exports.AbstractComponent = Component.specialize({
    _me: {
        value: null
    },

    $super: {
        get: function() {
            if (!this._me) {
                var self = this,
                    proxifyPrototype = function(prototype) {
                        var myPropertiesNames = Object.getOwnPropertyNames(prototype),
                            myPropertyName, myProperty;
                        for (var i = 0, length = myPropertiesNames.length; i < length; i++) {
                            myPropertyName = myPropertiesNames[i];
                            if (myPropertyName.substr(0,1) != '_' && myPropertyName !== '$super' && !self._me[myPropertyName]) {
                                myProperty = prototype[myPropertyName];
                                if (typeof myProperty === 'function') {
                                    addPropertyProxy(prototype, myPropertyName);
                                }
                            }
                        }
                    },
                    addPropertyProxy = function(prototype, propertyName) {
                        Object.defineProperty(self._me, propertyName, {
                            enumerable: true,
                            configurable: false,
                            writable: false,
                            value: function() {
                                return prototype[propertyName].apply(self, arguments);
                            }
                        });
                    };
                this._me = Object.create(null);
                var prototype = Object.getPrototypeOf(this.constructor.prototype);
                while (prototype) {
                    proxifyPrototype(prototype);
                    if (prototype === AbstractComponent.prototype) {
                        break;
                    }
                    prototype = Object.getPrototypeOf(prototype);
                }
            }
            return this._me;
        }
    },

    _callSuperMethod: {
        value: function(parentClass, methodName, args) {
            var method = parentClass.prototype[methodName];
            if (typeof method === "function") {
                method.apply(this, args);
            }
        }
    }
});
