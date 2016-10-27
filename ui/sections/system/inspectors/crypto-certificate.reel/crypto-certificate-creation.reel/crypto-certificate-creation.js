var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    CryptoCertificateType = require("core/model/enumerations/crypto-certificate-type").CryptoCertificateType,
    CryptoCertificateDigestalgorithm = require("core/model/enumerations/crypto-certificate-digestalgorithm").CryptoCertificateDigestalgorithm;

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
            this.countryCodes = [];
            return Promise.all([
                this.application.cryptoCertificateService.listCertificates().then(function (certificates) {
                    return self.certificates = certificates;
                }),
                this.application.cryptoCertificateService.listCountryCodes().then(function (countryCodes) {
                    return self.countryCodes = Object.keys(countryCodes).sort().map(function(x) {
                        return {
                            label: x,
                            value: countryCodes[x]
                        };
                    });
                })
            ]);
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (this.object && this.object.type === CryptoCertificateType.CA_INTERNAL) {
                this.object.selfsigned = true;
            }
        }
    },

    exitDocument: {
        value: function() {
            this.context = null;
        }
    }
});
