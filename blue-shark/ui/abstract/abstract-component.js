var Component = require("montage/ui/component").Component,
    i18next = require('i18next'),
    xhrBackend = require("i18next-xhr-backend");

var AbstractComponent = exports.AbstractComponent = Component.specialize({
    hasTemplate: {
        value: false
    },

    result: {
        value: void 0
    },

    _value: {
        value: void 0
    },

    value: {
        get: function() {
            return this._value;
        }, set: function(value) {
            if (this._value !== value) {
                this._value = value;
                this._refreshResult();
            }
        }
    },

    _args: {
        value: void 0
    },

    args: {
        get: function() {
            return this._args;
        }, set: function(args) {
            if (this._args !== args) {
                this._args = args;
                this._refreshResult();
            }
        }
    },

    translate: {
        value: function(value, args) {
            var result = '';
            if (AbstractComponent._cache.has([value, args])) {
                result = AbstractComponent._cache.get(value);
            } else {
                if (value) {
                    result = AbstractComponent.i18next.then(function(t) {
                        var translated = t(value, args) || value;
                        AbstractComponent._cache.set([value, args], translated);
                        return translated;
                    });
                }
            }
            return Promise.resolve(result);
        }
    }
}, {
    _cache: {
        value: new Map()
    },

    _i18next: {
        value: void 0
    },

    i18next: {
        get: function() {
            if (!this._i18next) {
                var self = this;
                this._i18next = new Promise(function(resolve) {
                    i18next
                        .use(xhrBackend)
                        .init({
                            debug: true,
                            lng: self._getLanguage(),
                            fallbackLng: 'fr',
                            nsSeparator: false,
                            keySeparator: false,
                            interpolation: {
                                escapeValue: false,
                                prefix: '{',
                                suffix: '}'
                            },
                            backend: {
                                loadPath: '/node_modules/blue-shark/assets/locales/{lng}/{ns}.json'
                            }
                        }, function(err, t) {
                            resolve(t);
                        });
                });
            }
            return this._i18next;
        }
    },

    _getLanguage: {
        value: function() {
            var language = navigator.language;
            var lngParam = location.hash.split(/[?&]/).filter(function(x) { return x.indexOf('lng=') === 0})[0];
            if (lngParam) {
                language = lngParam.split('=')[1] || language;
            }
            return language;
        }
    }
});

