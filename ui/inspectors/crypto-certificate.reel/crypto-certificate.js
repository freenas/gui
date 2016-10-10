var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    CryptoCertificateType = require("core/model/enumerations/crypto-certificate-type").CryptoCertificateType,
    CryptoCertificateDigestalgorithm = require("core/model/enumerations/crypto-certificate-digestalgorithm").CryptoCertificateDigestalgorithm;

exports.CryptoCertificate = Component.specialize({

    keyLenghtOptions: {
        value: [
            1024,
            2048,
            4096
        ]
    },

    caIdOptions: {
        value: null
    },

    algorithmOptions: {
        value: null
    },

    signing_ca_id: {
        value: null
    },

    templateDidLoad: {
        value: function() {
        }
    },
    enterDocument: {
        value: function(isFirstTime) {
            if (!!this.object._isNew && !this.object.type) {
                this.object.type = "LOADER";
            }
            this.algorithmOptions = [];
            this.caIdOptions = [];
            this.object.certificate = {};
            for (var i = 0; i < CryptoCertificateDigestalgorithm.members.length; i++) {
                this.algorithmOptions.push({label: CryptoCertificateDigestalgorithm.members[i], value: CryptoCertificateDigestalgorithm[CryptoCertificateDigestalgorithm.members[i]]});
            };
            this.application.cryptoCertificateService.listCertificates().then(function (certificates) {
                console.log(certificates);
            });
            this.caIdOptions.unshift({label:"---", value:null});
        }
    },

    handleImportCertificateAction: {
        value: function() {
            this.object.creationType = "IMPORT";
            this.object.certificate = CryptoCertificateType.CERT_EXISTING;
        }
    },

    handleCreateCertificateAction: {
        value: function () {
            this.object.creationType = "CREATE";
        }
    }
});
