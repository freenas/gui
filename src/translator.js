var Montage = require("montage").Montage,
    i18next = require('i18next'),
    moment = require('moment'),
    numeral = require('numeral'),
    xhrBackend = require('i18next-xhr-backend');

exports.Translator = Montage.specialize({}, {
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
                            lng: self._getLanguage(),
                            load: 'languageOnly',
                            fallbackLng: 'en',
                            nsSeparator: '$$',
                            keySeparator: false,
                            ns: [
                                'help',
                                'translation'
                            ],
                            fallbackNS: 'translation',
                            interpolation: {
                                escapeValue: false,
                                prefix: '{',
                                suffix: '}',
                                format: function(value, format, lng) {
                                    if(value instanceof Date) {
                                        return moment(value).format(format);
                                    }
                                    if (typeof value === 'number') {
                                        return numeral(value).format(format);
                                    }
                                    return value;
                                }
                            },
                            backend: {
                                loadPath: '/assets/locales/{lng}/{ns}.json'
                            }
                        }, function(err, t) {
                            resolve(t);
                        });
                    i18next.on('languageChanged', function(lng) {
                        moment.locale(lng);
                    });
                });
            }
            return this._i18next;
        }
    },

    translate: {
        value: function(value, args) {
            var self = this,
                result = '';
            if (this._cache.has([value, args])) {
                result = this._cache.get(value);
            } else {
                if (value) {
                    result = self.i18next.then(function(t) {
                        var translated;
                        try {
                            translated = ((typeof value !== 'object' || args) && typeof value !== 'boolean') ? t(value, args) : value;
                            self._cache.set([value, args], translated);
                        } catch (e) {
                            translated = value;
                        }
                        return translated;
                    });
                }
            }
            return Promise.resolve(result);
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
