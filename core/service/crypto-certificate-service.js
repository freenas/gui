var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    CryptoCertificateType = require("core/model/enumerations/crypto-certificate-type").CryptoCertificateType,
    Model = require("core/model/model").Model;

var CryptoCertificateService = exports.CryptoCertificateService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    TYPE_TO_LABEL: {
        value: {}
    },

    constructor: {
        value: function () {
            this.TYPE_TO_LABEL[ CryptoCertificateType.CERT_INTERNAL ] = "Create Interal Certificate";
            this.TYPE_TO_LABEL[ CryptoCertificateType.CERT_CSR] = "Create Signing Request";
            this.TYPE_TO_LABEL[ CryptoCertificateType.CERT_EXISTING] = "Import Certificate";
            this.TYPE_TO_LABEL[ CryptoCertificateType.CA_INTERNAL] = "Create Internal CA";
            this.TYPE_TO_LABEL[ CryptoCertificateType.CA_INTERMEDIATE] = "Create Intermediate CA";
            this.TYPE_TO_LABEL[ CryptoCertificateType.CA_EXISTING] = "Import CA";
        }
    },
    createCertInternal: {
        value: function () {
            return this._createNewCryptoCert(CryptoCertificateType.CERT_INTERNAL);
        }
    },

    createCertCSR: {
        value: function () {
            return this._createNewCryptoCert(CryptoCertificateType.CERT_CSR);
        }
    },

    importCert: {
        value: function () {
            return this._createNewCryptoCert(CryptoCertificateType.CERT_EXISTING);
        }
    },

    createCaInternal: {
        value: function () {
            return this._createNewCryptoCert(CryptoCertificateType.CA_INTERNAL);
        }
    },

    createCaIntermediate: {
        value: function () {
            return this._createNewCryptoCert(CryptoCertificateType.CA_INTERMEDIATE);
        }
    },

    importCa: {
        value: function () {
            return this._createNewCryptoCert(CryptoCertificateType.CA_EXISTING);
        }
    },

    import: {
        value: function (cryptoCertificate) {
            var payload = {},
                keys = Object.keys(cryptoCertificate),
                key;
            for (var i = 0; i < keys.length; i++) {
                key = keys[i];
                if (key[0] !== '_' && cryptoCertificate.hasOwnProperty('_' + key)) {
                    payload[key] = cryptoCertificate[key];
                }
            }
            return cryptoCertificate.services.import(payload);
        }
    },

    listCertificates: {
        value: function () {
            return this._dataService.fetchData(Model.CryptoCertificate).then(function (certificates) {
                return certificates;
            })
        }
    },

    _createNewCryptoCert: {
        value: function (certType) {
            var self = this;
            return this._dataService.getNewInstanceForType(Model.CryptoCertificate).then(function(cryptoCertificate) {
                cryptoCertificate._isNewObject = true;
                cryptoCertificate.type = certType;
                cryptoCertificate._action = certType === CryptoCertificateType.CA_EXISTING || certType === CryptoCertificateType.CERT_EXISTING ? "import" : "creation";
                cryptoCertificate._label = self.TYPE_TO_LABEL[certType];
                return cryptoCertificate;
            })
        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new CryptoCertificateService();
                this._instance._dataService = FreeNASService.instance;
            }
            return this._instance;
        }
    }
})
