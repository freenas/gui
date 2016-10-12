var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    CryptoCertificateType = require("core/model/enumerations/crypto-certificate-type").CryptoCertificateType,
    CryptoCertificateDigestalgorithm = require("core/model/enumerations/crypto-certificate-digestalgorithm").CryptoCertificateDigestalgorithm;

exports.CryptoCertificateCreation = Component.specialize(/** @lends CryptoCertificateCreation# */ {
    keyLenghtOptions: {
        value: [
            1024,
            2048,
            4096
        ]
    },

    signing_ca_id: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            this.algorithmOptions = [];
            for (var i = 0; i < CryptoCertificateDigestalgorithm.members.length; i++) {
                this.algorithmOptions.push({label: CryptoCertificateDigestalgorithm.members[i], value: CryptoCertificateDigestalgorithm[CryptoCertificateDigestalgorithm.members[i]]});
            };
            this.application.cryptoCertificateService.listCertificates().then(function (certificates) {
                this.certificates = certificates;
            })
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
