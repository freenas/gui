var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    CryptoCertificateType = require("core/model/enumerations/crypto-certificate-type").CryptoCertificateType,
    CryptoCertificateDigestalgorithm = require("core/model/enumerations/crypto-certificate-digestalgorithm").CryptoCertificateDigestalgorithm;

exports.CryptoCertificateCreation = Component.specialize(/** @lends CryptoCertificateCreation# */ {
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

    templateDidLoad: {
        value: function () {
            var self = this;
            this.algorithmOptions = [];
            this.countryCodes = [];
            for (var i = 0; i < CryptoCertificateDigestalgorithm.members.length; i++) {
                this.algorithmOptions.push({label: CryptoCertificateDigestalgorithm.members[i], value: CryptoCertificateDigestalgorithm[CryptoCertificateDigestalgorithm.members[i]]});
            };
            this.application.cryptoCertificateService.listCertificates().then(function (certificates) {
                self.certificates = certificates;
            });
            this.application.cryptoCertificateService.listCountryCodes().then(function (countryCodes) {
                for (var i = 0; i < Object.keys(countryCodes).length; i++) {
                    self.countryCodes.push({label:Object.keys(countryCodes)[i], value: Object.values(countryCodes)[i]});
                }
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (this.object.type === CryptoCertificateType.CA_INTERNAL) {
                this.object.selfsigned = true;
            }
        }
    }
});
