var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    CryptoCertificateDigestalgorithm = require("core/model/enumerations/crypto-certificate-digestalgorithm").CryptoCertificateDigestalgorithm,
    _ = require("lodash");

exports.CryptoCertificateCreation = AbstractInspector.specialize(/** @lends CryptoCertificateCreation# */ {
    keyLenghtOptions: {
        value: [
            {label: 1024, value: 1024},
            {label: 2048, value: 2048},
            {label: 4096, value: 4096}
        ]
    },

    signing_ca_id: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this.algorithmOptions = CryptoCertificateDigestalgorithm.members.map(function(x) {
                return {
                    label: x,
                    value: x
                };
            });
            return Promise.all([
                this._sectionService.listCertificates(),
                this._sectionService.listCountryCodes()
            ]).spread(function(certificates, countryCodes) {
                self.certificates = certificates;
                self.countryCodes = _.chain(countryCodes)
                    .toPairs()
                    .sortBy(0)
                    .map(function(x) {
                        return {
                            label: _.capitalize(_.toLower(x[0])),
                            value: x[1]
                        }
                    })
                    .value();
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (this.object._isNew) {
                this.object.key_length = 4096;
                this.object.country = "US";
                this.object.lifetime = 3000;
            }
        }
    },

    exitDocument: {
        value: function() {
            this.context = null;
        }
    }
});
