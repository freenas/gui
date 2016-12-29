"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var crypto_certificate_dao_1 = require("../dao/crypto-certificate-dao");
var model_event_name_1 = require("../model-event-name");
var crypto_certificate_type_1 = require("core/model/enumerations/crypto-certificate-type");
var immutable_1 = require("immutable");
var _ = require("lodash");
var CryptoCertificateRepository = (function (_super) {
    __extends(CryptoCertificateRepository, _super);
    function CryptoCertificateRepository(cryptoCertificateDao) {
        _super.call(this, ['CryptoCertificate']);
        this.cryptoCertificateDao = cryptoCertificateDao;
        this.TYPE_TO_LABEL = new immutable_1.Map()
            .set(crypto_certificate_type_1.CryptoCertificateType.CERT_INTERNAL, "Create Internal Certificate")
            .set(crypto_certificate_type_1.CryptoCertificateType.CERT_CSR, "Create Signing Request")
            .set(crypto_certificate_type_1.CryptoCertificateType.CERT_EXISTING, "Import Certificate")
            .set(crypto_certificate_type_1.CryptoCertificateType.CA_INTERNAL, "Create Internal CA")
            .set(crypto_certificate_type_1.CryptoCertificateType.CA_INTERMEDIATE, "Create Intermediate CA")
            .set(crypto_certificate_type_1.CryptoCertificateType.CA_EXISTING, "Import CA");
    }
    CryptoCertificateRepository.getInstance = function () {
        if (!CryptoCertificateRepository.instance) {
            CryptoCertificateRepository.instance = new CryptoCertificateRepository(new crypto_certificate_dao_1.CryptoCertificateDao());
        }
        return CryptoCertificateRepository.instance;
    };
    CryptoCertificateRepository.prototype.listCryptoCertificates = function () {
        return this.cryptoCertificateDao.list();
    };
    CryptoCertificateRepository.prototype.listCountryCodes = function () {
        return this.cryptoCertificateDao.listCountryCodes();
    };
    CryptoCertificateRepository.prototype.getNewCryptoCertificate = function (cryptoCertificateType) {
        var label = this.TYPE_TO_LABEL.get(cryptoCertificateType), action = cryptoCertificateType === crypto_certificate_type_1.CryptoCertificateType.CA_EXISTING ||
            cryptoCertificateType === crypto_certificate_type_1.CryptoCertificateType.CERT_EXISTING ? "import" : "creation";
        if (label) {
            return this.cryptoCertificateDao.getNewInstance().then(function (cryptoCertificate) {
                cryptoCertificate._isNewObject = true;
                cryptoCertificate._tmpId = _.kebabCase(cryptoCertificateType);
                cryptoCertificate.type = cryptoCertificateType;
                cryptoCertificate._action = action;
                cryptoCertificate._label = label;
                return cryptoCertificate;
            });
        }
    };
    CryptoCertificateRepository.prototype.saveCryptoCertificate = function (object, isServiceEnabled) {
        return this.cryptoCertificateDao.save(object, object._isNew ? [null, isServiceEnabled] : [isServiceEnabled]);
    };
    CryptoCertificateRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'CryptoCertificate':
                this.cryptoCertificates = this.dispatchModelEvents(this.cryptoCertificates, model_event_name_1.ModelEventName.CryptoCertificate, state);
                break;
            default:
                break;
        }
    };
    CryptoCertificateRepository.prototype.handleEvent = function (name, data) { };
    return CryptoCertificateRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.CryptoCertificateRepository = CryptoCertificateRepository;
